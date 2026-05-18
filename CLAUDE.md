# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with hot reload (tsx watch)
npm run build        # Compile TypeScript + resolve path aliases (tsc && tsc-alias)
npm start            # Run compiled production build
npm run lint         # Check for lint errors
npm run lint:fix     # Auto-fix lint errors
npm run format       # Format with Prettier

docker compose up -d # Start PostgreSQL 16 + Redis 7
```

No test runner is configured yet (`npm test` exits 1).

## Architecture

This is a **module-based clean architecture** project. Each domain feature lives under `src/module/<module-name>/` and is internally layered:

```
src/module/<name>/
  domain/          # Entities, value objects, domain errors, repository interfaces
  application/     # DTOs, port interface (module_port.ts), use cases
  infarstructure/  # Repository implementations (TypeORM), external service adapters
  presentation/    # Express controller, router, Zod request validation
  module.ts        # Wires router, controller, use cases together
  module_adapter.ts # Implements the application port using infrastructure
```

**Request flow**: Router → Controller → UseCase (via Port) → Repository → Database

The **port/adapter pattern** decouples application logic from infrastructure: `application/module_port.ts` defines the interface; `module_adapter.ts` bridges it to the actual repository in `infarstructure/`.

`src/shared/` contains cross-cutting concerns: logging (Winston), response helpers (`Success`, `HttpError`/`NotFoundError`/`BadRequestError`/`UnauthorizedError`), JWT utilities, and password hashing.

`src/config/` centralizes all runtime config. `env.ts` loads `.env.{NODE_ENV}.local` → `.env.{NODE_ENV}` → `.env.local` → `.env` in priority order. `config.ts` exposes a typed `Config` object used everywhere instead of reading `process.env` directly.

## Path Aliases

TypeScript paths are configured in `tsconfig.json` and resolved at build time via `tsc-alias`:

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `@config/*` | `src/config/*` |
| `@shared/*` | `src/shared/*` |
| `@domain/*` | `src/domain/*` |
| `@application/*` | `src/application/*` |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@presentation/*` | `src/presentation/*` |

## Key Infrastructure

- **Database**: PostgreSQL via TypeORM. Entities go in `src/shared/infrastructure/database/entities/`, migrations in `src/shared/infrastructure/database/migrations/`. `DB_SYNC=false` by default — use migrations in production.
- **Cache**: Redis via ioredis. `redisClient` (singleton) exposes `ICacheClient` + `IJsonCacheClient` interfaces including `getJson`/`setJson` helpers.
- **Auth**: JWT with separate access (15m) and refresh (7d) tokens. Secrets default to placeholder strings — always override in `.env`.
- **DI**: tsyringe with `reflect-metadata`. Decorators require `experimentalDecorators` and `emitDecoratorMetadata` (already set in `tsconfig.json`).
- **Validation**: Zod for request validation in `presentation/validate.ts` per module.
- **Logging**: Winston writes to `logs/app.log` and `logs/error.log`. Use `baseLogger` from `src/shared/logging/logger.ts`.

## Domain Model Summary

28 tables across these domains (see `docs/database.md` for full schema):
- **User**: Account, PersonalInformation, ShippingAddress
- **Cart**: Cart, CartItemDetail
- **Orders**: Order, OrderStatusHistory, OrderItem
- **Products**: Product, Variant, VariantGroup, VariantValue, VariantDetail
- **Classification**: ProductType, Category, CategoryDetail, Attribute, ProductDetail
- **Promotions**: DiscountCode, PromotionProgram, PromotionDetail
- **Media & Reviews**: MediaFile, ProductReview
