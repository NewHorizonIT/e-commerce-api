# E-Commerce API

Backend API cho hệ thống thương mại điện tử, xây dựng bằng Node.js + TypeScript + Express.
Dự án tập trung vào kiến trúc module rõ ràng, dễ mở rộng, kết hợp PostgreSQL (TypeORM) và Redis cho hiệu năng và quản lý phiên đăng nhập.

## 1. Mô tả dự án

### Mục tiêu

- Cung cấp REST API cho các nghiệp vụ e-commerce.
- Tách biệt domain theo module để giảm coupling giữa các team.
- Dễ scale theo chiều ngang và dễ bảo trì trong dài hạn.

### Công nghệ chính

- Runtime: Node.js 20+
- Ngôn ngữ: TypeScript
- HTTP framework: Express 5
- ORM: TypeORM
- Database: PostgreSQL
- Cache / session store: Redis
- Validation: Zod
- Logging: Winston + Morgan
- Security middleware: Helmet, CORS, Cookie Parser, Compression

### Module hiện có

- Auth module
- Product module

## 2. Kiến trúc dự án

Dự án áp dụng kiến trúc module theo hướng tách lớp:

- `presentation`: Router, controller, validate request
- `application`: DTO, use case, module port
- `domain`: Entity logic, interface, value object
- `infarstructure`: ORM entity, repository, persistence adapter

Luồng xử lý tổng quát:

1. Request đi vào `router`.
2. Validate input bằng Zod middleware.
3. Controller gọi `module port` ở tầng application.
4. Use case xử lý nghiệp vụ, gọi repository.
5. Repository làm việc với PostgreSQL qua TypeORM.
6. Trả response theo format thống nhất qua lớp `SuccessResponse`.

Ngoài module nghiệp vụ, dự án có tầng `shared` cho middleware, logging, error handling và response chuẩn.

## 3. Cấu trúc thư mục

```text
.
├─ server.ts
├─ src/
│  ├─ app.ts
│  ├─ config/
│  │  ├─ config.ts
│  │  ├─ database.ts
│  │  ├─ env.ts
│  │  └─ redis.ts
│  ├─ module/
│  │  ├─ auth/
│  │  │  ├─ application/
│  │  │  ├─ domain/
│  │  │  ├─ infarstructure/
│  │  │  └─ presentation/
│  │  └─ product/
│  │     ├─ application/
│  │     ├─ domain/
│  │     ├─ infarstructure/
│  │     └─ presentation/
│  └─ shared/
│     ├─ error/
│     ├─ logging/
│     ├─ middleware/
│     ├─ response/
│     └─ utils/
├─ docs/
│  ├─ database.md
│  └─ swagger.yml
├─ docker/
│  └─ postgres/init/
├─ docker-compose.yml
└─ Dockerfile
```

## 4. Hướng dẫn chạy project

### 4.1 Yêu cầu môi trường

- Node.js >= 20
- npm >= 10
- Docker + Docker Compose (khuyến nghị để chạy PostgreSQL/Redis)

### 4.2 Cài dependency

```bash
npm install
```

### 4.3 Cấu hình biến môi trường

Hiện tại file `.env.example` đang trống, bạn tạo file `.env` ở root project và khai báo tối thiểu:

```env
NODE_ENV=development
APP_NAME=e-commerce-api
APP_HOST=localhost
APP_PORT=3000
API_PREFIX=/api
API_VERSION=v1

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_db
DB_SSL=false
DB_SYNC=false
DB_LOGGING=false
DB_MAX_CONNECTIONS=10
DB_CONNECTION_TIMEOUT=10000

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_KEY_PREFIX=ecommerce:

JWT_ACCESS_TOKEN_SECRET=your-access-secret
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_SECRET=your-refresh-secret
JWT_REFRESH_TOKEN_EXPIRATION=7d

CORS_ENABLED=true
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
CORS_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With
CORS_CREDENTIALS=true

RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_MESSAGE=Too many requests, please try again later.

LOG_LEVEL=debug
LOG_FORMAT=json
LOG_DIRECTORY=logs
```

### 4.4 Chạy PostgreSQL + Redis bằng Docker

```bash
docker compose up -d postgres redis
```

Kiểm tra container:

```bash
docker compose ps
```

### 4.5 Chạy ứng dụng (development)

```bash
npm run dev
```

API health check:

- `GET http://localhost:3000/health`
- `GET http://localhost:3000/`

### 4.6 Build và chạy production local

Build:

```bash
npm run build
```

Run:

```bash
npm start
```

### 4.7 Lint và format

```bash
npm run lint
npm run lint:fix
npm run format
```

## 5. API base path

Base path mặc định:

- `/api/v1/auth`
- `/api/v1` (product và các resource liên quan)

## 6. Ghi chú cho team backend

- Ưu tiên mở rộng theo module mới (`src/module/<module-name>`), không đặt business logic trực tiếp trong router/controller.
- Giữ nguyên pattern validate input ở tầng presentation bằng Zod.
- Dùng `shared/error` và `shared/response` để chuẩn hóa format trả về.
- Khi thêm entity mới, nhớ đăng ký vào datasource trong `src/config/database.ts`.
- Khi thay đổi schema DB, ưu tiên migration thay vì bật `DB_SYNC=true` ở môi trường production.
