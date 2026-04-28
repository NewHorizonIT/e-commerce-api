# Backend Module Development Guide

Tài liệu này quy định cách phát triển module backend để:

- Giảm xung đột khi nhiều người làm song song.
- Tránh xung đột dependency/DI/runtime.
- Giữ chất lượng code nhất quán giữa các module.

## 1. Mục tiêu và nguyên tắc

- One module = one bounded context (auth, cart, order, ...).
- Clean boundaries: presentation -> application -> domain -> infrastructure.
- Composition root tập trung: chỉ register dependency tại 1 nơi.
- Không side-effect import để register DI.
- API contract và error contract phải ổn định, version rõ ràng.

## 2. Cấu trúc module bắt buộc

Tạo module theo khung:

```text
src/module/<module-name>/
  container.ts
  module.ts
  tokens.ts
  application/
    dtos.ts
    module_port.ts
    usecase/
  domain/
    domain.ts
    errors.ts
    interface.ts
    value_objects.ts
  infrastructure/
    repository.ts
    <entities>.ts
  presentation/
    controller.ts
    router.ts
    validate.ts
```

Quy ước:

- Đặt tên thư mục là `infrastructure` (không typo).
- Không để business logic trong controller/repository mapper.
- Usecase là nơi điều phối logic nghiệp vụ.

## 3. DI và Composition Root (bắt buộc)

### 3.1 Quy tắc

- Mỗi module export hàm `register<Module>Dependencies(container)` trong `container.ts`.
- Chỉ register dependency trong composition root tập trung.
- Không được `import './container'` để auto-register.
- Entry point phải import `reflect-metadata` trước tất cả import khác.

### 3.2 Ví dụ

`src/module/order/container.ts`

```ts
import { type DependencyContainer } from 'tsyringe';
import { ORDER_TOKENS } from './tokens';
import { TypeORMOrderRepository } from './infrastructure/repository';
import { OrderModuleAdapter } from './module_adapter';

export function registerOrderDependencies(container: DependencyContainer): void {
  container.registerSingleton(ORDER_TOKENS.IOrderRepository, TypeORMOrderRepository);
  container.registerSingleton(ORDER_TOKENS.IOrderModulePort, OrderModuleAdapter);
}
```

`src/shared/container/index.ts`

```ts
import { container, type DependencyContainer } from 'tsyringe';
import { registerAuthDependencies } from '@/module/auth/container';
import { registerOrderDependencies } from '@/module/order/container';

export function initContainer(c: DependencyContainer = container): DependencyContainer {
  registerAuthDependencies(c);
  registerOrderDependencies(c);
  return c;
}
```

`server.ts`

```ts
import 'reflect-metadata';
// import khác...

initContainer();
const { default: app } = await import('./src/app');
```

## 4. Quy tắc route và wiring module

- Mỗi module expose `create<Module>Router(controller)`.
- App wiring route tại `src/app.ts`, không resolve dependency trực tiếp tại đây.
- Prefix route theo quy ước: `/<apiPrefix>/<apiVersion>/<module>`.

Ví dụ:

- `/api/v1/auth/*`
- `/api/v1/orders/*`

## 5. Error contract và response contract

### 5.1 Error

- Tất cả lỗi nghiệp vụ phải extend `AppError`.
- Mỗi error có `code` ổn định (machine-readable), ví dụ: `ORDER_INVALID_STATUS`.
- Không throw raw `Error` trong usecase/domain.

### 5.2 Success response

- Dùng chung response wrapper đã có trong project.
- Message là optional, nhưng shape response phải ổn định giữa các endpoint.

## 6. Quy tắc database và migration

- Không dùng `synchronize=true` trên production.
- Mọi thay đổi schema phải qua migration.
- Entity mapper không được chứa logic nghiệp vụ.
- Repository chỉ truy cập data, không thay usecase.

## 7. Quy tắc auth và security

- JWT payload claims phải thống nhất toàn bộ hệ thống (ví dụ chỉ dùng `id` hoặc chỉ dùng `userId`).
- Secret bắt buộc qua env ở production, không dùng fallback weak secret.
- Bật rate limit cho endpoint nhạy cảm: login, refresh, forgot password.
- Cookie auth cần cấu hình `httpOnly`, `secure`, `sameSite` theo môi trường.

## 8. Quy tắc tránh conflict khi làm song song

### 8.1 Chia scope file theo module

Mỗi task chỉ sửa trong:

- `src/module/<module-name>/**`
- `src/shared/container/index.ts` (nếu cần register module)
- `src/app.ts` (nếu cần mount route)
- `docs/swagger.yml` (nếu có API mới)

Tránh sửa cùng lúc:

- File global nhạy cảm (config chung, logger chung) khi không cần thiết.

### 8.2 Git workflow để giảm xung đột

- Nhánh branch theo ticket: `feature/<module>-<ticket>`.
- Rebase thường xuyên với nhánh chính.
- PR nhỏ, theo từng vertical slice (schema -> domain -> usecase -> route).
- Nếu thay đổi contract chung, phải thông báo team trước khi merge.

### 8.3 Ownership

- Mỗi module có 1 owner chính + 1 backup reviewer.
- File global (`src/shared/**`, `src/config/**`) cần reviewer bắt buộc.

## 9. Checklist trước khi mở PR

- [ ] Đã đăng ký DI qua composition root tập trung.
- [ ] Không còn side-effect import để register container.
- [ ] Không lỗi typecheck/build/lint.
- [ ] Swagger được cập nhật cho endpoint mới.
- [ ] Error code và HTTP status đúng theo quy ước.
- [ ] Test thủ công flow chính: success + invalid input + unauthorized + not found.
- [ ] Không để log nhạy cảm (password/token/secret).

## 10. Definition of Done cho module moi

- Có folder module đầy đủ theo mẫu.
- Có tối thiểu 1 usecase hoạt động end-to-end.
- Có route + validate + controller + usecase + repository.
- Đã register dependency vào composition root.
- Có update docs API.

## 11. Mẫu task breakdown để team follow

1. Tạo skeleton module và register dependency.
2. Tạo entity/value object + domain rules.
3. Tạo repository + mapper + migration.
4. Tạo usecase + DTO + error.
5. Tạo controller/router/validate.
6. Mount route vào app.
7. Cập nhật swagger + self-review checklist.

## 12. Common anti-pattern cần tránh

- Resolve container trong file utility/global singleton không kiểm soát.
- Controller chứa business logic.
- Repository throw lỗi nghiệp vụ.
- Token payload mỗi nơi một kiểu (`id` vs `userId`).
- Import thư viện gây side effect để khởi tạo ngầm.

---

Nếu cần mở rộng module mới, hãy copy khung này và giữ đúng quy tắc DI + contract.
Khi tất cả module follow cùng một chuẩn, conflict khi merge sẽ giảm rất mạnh.
