# Code Patterns Reference

Detailed code patterns for the E-Commerce API project.

## Entity Pattern (Domain Layer)

```typescript
// src/domain/entities/{name}.entity.ts
import { v4 as uuidv4 } from 'uuid';

export interface UserProps {
  id?: string;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity {
  readonly id: string;
  readonly email: string;
  private _password: string;
  private _name: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id ?? uuidv4();
    this.email = props.email;
    this._password = props.password;
    this._name = props.name;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  get password(): string {
    return this._password;
  }

  get name(): string {
    return this._name;
  }

  updateName(name: string): void {
    this._name = name;
    this.updatedAt = new Date();
  }

  updatePassword(hashedPassword: string): void {
    this._password = hashedPassword;
    this.updatedAt = new Date();
  }
}
```

## Repository Interface Pattern (Domain Layer)

```typescript
// src/domain/repositories/{name}.repository.ts
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  save(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
```

## DTO Pattern with Zod (Application Layer)

```typescript
// src/application/dtos/{name}/{action}-{name}.dto.ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

// Response DTO (exclude sensitive fields)
export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserResponseDTO = z.infer<typeof UserResponseSchema>;
```

## Use Case Pattern (Application Layer)

```typescript
// src/application/use-cases/{name}/{action}-{name}.use-case.ts
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { CreateUserDTO } from '@application/dtos/user/create-user.dto';
import { hashPassword } from '@shared/utils/hash-password';
import { UserAlreadyExistsError } from '@domain/errors/user-already-exists.error';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CreateUserDTO): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(dto.email);
    }

    const hashedPassword = await hashPassword(dto.password);
    const user = new UserEntity({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    return this.userRepository.save(user);
  }
}
```

## Repository Implementation (Infrastructure Layer)

```typescript
// src/infrastructure/repositories/{name}.repository.impl.ts
import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { IUserRepository } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { UserModel } from '@infrastructure/database/models/user.model';
import { AppDataSource } from '@infrastructure/database/data-source';

@injectable()
export class UserRepositoryImpl implements IUserRepository {
  private readonly repository: Repository<UserModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserModel);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? this.toDomain(model) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const model = await this.repository.findOne({ where: { email } });
    return model ? this.toDomain(model) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const models = await this.repository.find();
    return models.map((model) => this.toDomain(model));
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const model = this.toModel(user);
    const saved = await this.repository.save(model);
    return this.toDomain(saved);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const model = this.toModel(user);
    const updated = await this.repository.save(model);
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(model: UserModel): UserEntity {
    return new UserEntity({
      id: model.id,
      email: model.email,
      password: model.password,
      name: model.name,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  private toModel(entity: UserEntity): Partial<UserModel> {
    return {
      id: entity.id,
      email: entity.email,
      password: entity.password,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
```

## TypeORM Model (Infrastructure Layer)

```typescript
// src/infrastructure/database/models/{name}.model.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserModel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
```

## Controller Pattern (Presentation Layer)

```typescript
// src/presentation/http/controllers/{name}.controller.ts
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreateUserUseCase } from '@application/use-cases/user/create-user.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';
import { CreateUserSchema } from '@application/dtos/user/create-user.dto';
import { successResponse } from '@shared/utils/response/success';

export class UserController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = CreateUserSchema.parse(req.body);
      const useCase = container.resolve(CreateUserUseCase);
      const user = await useCase.execute(dto);

      res.status(201).json(successResponse(user, 'User created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const useCase = container.resolve(GetUserByIdUseCase);
      const user = await useCase.execute(id);

      res.status(200).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = container.resolve(GetAllUsersUseCase);
      const users = await useCase.execute();

      res.status(200).json(successResponse(users));
    } catch (error) {
      next(error);
    }
  }
}
```

## Routes Pattern (Presentation Layer)

```typescript
// src/presentation/http/routes/{name}.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/authentication.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { CreateUserSchema } from '@application/dtos/user/create-user.dto';

const router = Router();
const controller = new UserController();

// Public routes
router.post('/', validateRequest(CreateUserSchema), controller.create.bind(controller));

// Protected routes
router.get('/', authMiddleware, controller.getAll.bind(controller));
router.get('/:id', authMiddleware, controller.getById.bind(controller));

export default router;
```

## Authentication Middleware

```typescript
// src/presentation/http/middleware/authentication.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken } from '@shared/utils/jwt';
import { errorResponse } from '@shared/utils/response/error';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json(errorResponse('No token provided', 401));
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyJwtToken(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json(errorResponse('Invalid token', 401));
  }
};
```

## Validation Middleware

```typescript
// src/presentation/http/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { errorResponse } from '@shared/utils/response/error';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(errorResponse('Validation failed', 400, error.errors));
        return;
      }
      next(error);
    }
  };
};
```

## Response Utilities

```typescript
// src/shared/utils/response/success.ts
export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export const successResponse = <T>(data: T, message = 'Success'): SuccessResponse<T> => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

// src/shared/utils/response/error.ts
export interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: unknown;
  timestamp: string;
}

export const errorResponse = (
  message: string,
  statusCode = 500,
  errors?: unknown
): ErrorResponse => ({
  success: false,
  message,
  statusCode,
  errors,
  timestamp: new Date().toISOString(),
});
```

## Domain Error Pattern

```typescript
// src/domain/errors/{name}.error.ts
export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email "${email}" already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}

export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = 'UserNotFoundError';
  }
}
```

## Dependency Injection Setup

```typescript
// src/config/container.ts
import { container } from 'tsyringe';
import { IUserRepository } from '@domain/repositories/user.repository';
import { UserRepositoryImpl } from '@infrastructure/repositories/user.repository.impl';
import { IProductRepository } from '@domain/repositories/product.repository';
import { ProductRepositoryImpl } from '@infrastructure/repositories/product.repository.impl';

// Register repositories
container.registerSingleton<IUserRepository>('IUserRepository', UserRepositoryImpl);
container.registerSingleton<IProductRepository>('IProductRepository', ProductRepositoryImpl);

export { container };
```

## TypeORM Data Source

```typescript
// src/infrastructure/database/data-source.ts
import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // NEVER true in production
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/infrastructure/database/models/**/*.ts'],
  migrations: ['src/infrastructure/database/migrations/**/*.ts'],
});
```

## Express App Setup

```typescript
// src/app.ts
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import { AppDataSource } from '@infrastructure/database/data-source';
import { errorHandler } from '@presentation/http/middleware/error-handler.middleware';
import userRoutes from '@presentation/http/routes/user.routes';
import productRoutes from '@presentation/http/routes/product.routes';
import '@config/container'; // Initialize DI container

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
```
