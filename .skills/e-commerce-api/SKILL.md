---
name: e-commerce-api
description: Build and maintain E-Commerce REST APIs using Node.js, TypeScript, Express.js, TypeORM, and Clean Architecture. Use when working with this codebase, creating new features, entities, use cases, repositories, controllers, or following domain-driven design patterns.
license: MIT
metadata:
  author: black_hawk
  version: '1.0'
---

# E-Commerce API Development

## When to use this skill

Use this skill when:

- Creating new entities, repositories, use cases, or controllers in this project
- Following Clean Architecture and Domain-Driven Design patterns
- Working with TypeORM, Express.js, tsyringe dependency injection
- Implementing authentication, validation, or API endpoints
- Understanding the codebase structure and conventions

## Project Overview

This is an E-Commerce REST API built with:

- **Runtime**: Node.js with TypeScript (strict mode)
- **Framework**: Express.js v5
- **Database**: PostgreSQL with TypeORM
- **Architecture**: Clean Architecture (DDD)
- **DI Container**: tsyringe
- **Validation**: Zod
- **Authentication**: JWT
- **Logging**: Winston

## Architecture Rules

The project follows Clean Architecture with strict dependency rules:

```
Domain (innermost) → Application → Infrastructure → Presentation (outermost)
```

**Critical**: Inner layers MUST NOT import from outer layers.

```
src/
├── domain/           # Enterprise Business Rules
│   ├── entities/     # Business entities with behaviors
│   ├── errors/       # Domain-specific errors
│   ├── repositories/ # Repository interfaces (contracts)
│   └── value-objects/
├── application/      # Application Business Rules
│   ├── dtos/         # Data Transfer Objects (Zod schemas)
│   ├── interfaces/   # Application interfaces
│   ├── services/     # Application services
│   └── use-cases/    # Use case implementations
├── infrastructure/   # Frameworks & Drivers
│   ├── database/     # TypeORM config, migrations, models
│   └── repositories/ # Repository implementations
├── presentation/     # Interface Adapters
│   └── http/
│       ├── controllers/
│       ├── routes/
│       └── middleware/
└── shared/           # Cross-cutting utilities
    ├── utils/
    ├── types/
    └── constants/
```

## Naming Conventions

| Type       | Convention      | Example              |
| ---------- | --------------- | -------------------- |
| Files      | kebab-case      | `user-repository.ts` |
| Classes    | PascalCase      | `UserEntity`         |
| Interfaces | I-prefix        | `IUserRepository`    |
| Functions  | camelCase       | `getUserById`        |
| Constants  | SCREAMING_SNAKE | `MAX_RETRY`          |

### File Naming Patterns

```
{name}.entity.ts          # Domain entity
{name}.repository.ts      # Repository interface
{name}.repository.impl.ts # Repository implementation
{action}-{name}.use-case.ts  # Use case
{action}-{name}.dto.ts    # DTO with Zod schema
{name}.controller.ts      # HTTP controller
{name}.routes.ts          # Express routes
```

## Creating New Features

See detailed patterns in [references/CODE-PATTERNS.md](references/CODE-PATTERNS.md).

### Quick Reference

1. **Entity** (Domain): Define business object with behaviors
2. **Repository Interface** (Domain): Define data access contract
3. **DTO** (Application): Define input validation with Zod
4. **Use Case** (Application): Implement business logic
5. **Repository Impl** (Infrastructure): Implement data access
6. **Controller** (Presentation): Handle HTTP requests
7. **Routes** (Presentation): Define API endpoints

## E-Commerce Domain Concepts

Common entities:

- **User**: Customer/admin accounts (id, email, password, name, role)
- **Product**: Items for sale (id, name, price, stock, categoryId)
- **Category**: Product categorization (id, name, parentId)
- **Cart/CartItem**: Shopping cart
- **Order/OrderItem**: Placed orders
- **Payment**: Transactions
- **Review**: Product reviews
- **Address**: Shipping/billing

Order statuses: `Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`

## Key Constraints

1. **Never** import outer layers from inner layers
2. **Always** use dependency injection via tsyringe
3. **Always** validate inputs with Zod schemas
4. **Never** store plain text passwords
5. **Always** use environment variables for secrets
6. **Never** use `any` type - use `unknown` if uncertain
7. **Always** define explicit return types

## Import Aliases

```typescript
import { UserEntity } from '@domain/entities/user.entity';
import { IUserRepository } from '@domain/repositories/user.repository';
import { CreateUserUseCase } from '@application/use-cases/user/create-user.use-case';
import { successResponse } from '@shared/utils/response/success';
```

## Commands

```bash
npm run build    # Compile TypeScript
npm run start    # Start server
npm run dev      # Development mode
npm run test     # Run tests
```
