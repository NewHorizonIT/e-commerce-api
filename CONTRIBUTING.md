# Contributing Guide

Tài liệu này mô tả cách đóng góp code cho dự án theo Gitflow và các quy tắc kỹ thuật hiện tại.
Mục tiêu là giảm xung đột khi làm song song, giữ chất lượng code ổn định, và đảm bảo release an toàn.

## 1. Mô hình nhánh (Gitflow)

### Nhánh chính

- `main`: mã nguồn production, luôn ở trạng thái có thể phát hành.
- `develop`: nhánh tích hợp cho sprint hiện tại.

### Nhánh hỗ trợ

- `feat/<module>-<ticket>`: phát triển tính năng mới.
- `bugfix/<module>-<ticket>`: sửa lỗi trên `develop`.
- `release/<version>`: chuẩn bị release (chỉ bugfix nhỏ, docs, versioning).
- `hotfix/<ticket>`: sửa lỗi khẩn cấp từ `main`.

Ví dụ:

- `feat/cart-123`
- `bugfix/auth-401-refresh`
- `release/1.2.0`
- `hotfix/prod-login-timeout`

## 2. Quy trình làm việc chuẩn

1. Đồng bộ nhánh tích hợp:
   - `git checkout develop`
   - `git pull --rebase`
2. Tạo nhánh làm việc:
   - `git checkout -b feature/<module>-<ticket>`
3. Commit nhỏ, rõ nghĩa, theo từng vertical slice.
4. Rebase thường xuyên với `develop` để giảm conflict.
5. Mở PR vào `develop` khi hoàn tất.
6. Sau khi release:
   - tạo `release/<version>` từ `develop`
   - merge `release/<version>` vào `main`
   - tag version
   - merge ngược lại `develop`
7. Hotfix production:
   - tạo `hotfix/<ticket>` từ `main`
   - merge vào `main` và merge ngược về `develop`

## 3. Quy tắc phạm vi chỉnh sửa

Mỗi task ưu tiên chỉ sửa trong phạm vi:

- `src/module/<module-name>/**`
- `src/app.ts` (khi cần mount route)
- `docs/swagger.yml` (khi thêm/sửa API)
- file đăng ký dependency tập trung (nếu có)

Hạn chế sửa file global khi không cần thiết:

- `src/shared/**`
- `src/config/**`

Nếu bắt buộc sửa file global, PR phải có reviewer bắt buộc từ owner khu vực đó.

## 4. Quy tắc kiến trúc module

Bắt buộc tuân thủ cấu trúc:

- `presentation`: router, controller, validate
- `application`: dto, module port, usecase
- `domain`: business rule, interface, value object, domain error
- `infrastructure`: repository, entity mapper

Yêu cầu chính:

- Không để business logic trong controller/repository mapper.
- Không side-effect import để register DI.
- Register dependency tại composition root tập trung.
- Error nghiệp vụ phải kế thừa `AppError`, có `code` ổn định.
- Response phải theo wrapper chuẩn hiện có của dự án.

## 5. Quy tắc database và API contract

- Không dùng `synchronize=true` trên production.
- Mọi thay đổi schema phải qua migration.
- Khi thêm/sửa endpoint: cập nhật `docs/swagger.yml` trong cùng PR.
- Contract API phải ổn định và tương thích ngược trong phạm vi version hiện tại.

## 6. Tiêu chuẩn commit

Khuyến nghị dùng Conventional Commits:

- `feat(module): add cart voucher preview`
- `fix(auth): handle invalid refresh token`
- `refactor(product): split validator by usecase`
- `docs(api): update order endpoints`

Nguyên tắc:

- Một commit giải quyết một ý chính.
- Không commit code format hàng loạt không liên quan.
- Không commit secrets, token, mật khẩu, file `.env`.

## 7. Checklist trước khi mở PR

- [ ] Build pass: `npm run build`
- [ ] Lint pass: `npm run lint`
- [ ] Chạy app local thành công: `npm run dev`
- [ ] Cập nhật Swagger nếu API thay đổi
- [ ] Kiểm tra thủ công các luồng chính:
  - success
  - invalid input
  - unauthorized
  - not found
- [ ] Không có log nhạy cảm (password/token/secret)
- [ ] Rebase mới nhất với `develop`

## 8. Quy tắc review và merge

- Mỗi PR cần tối thiểu 1 approval.
- PR sửa file global (`src/shared/**`, `src/config/**`) cần thêm reviewer bắt buộc.
- Ưu tiên PR nhỏ, dễ review, theo vertical slice.
- Chỉ merge khi toàn bộ check bắt buộc đã pass.
- Ưu tiên `Squash and merge` để giữ lịch sử gọn.

## 9. Definition of Done

Một hạng mục được coi là Done khi:

- Có flow end-to-end: route -> validate -> controller -> usecase -> repository.
- Đăng ký dependency đầy đủ và đúng vị trí.
- Error contract và response contract đúng chuẩn.
- Swagger đã cập nhật tương ứng.
- Đã qua review và pass các kiểm tra bắt buộc.

## 10. Lệnh thường dùng

```bash
npm install
npm run dev
npm run build
npm run lint
npm run lint:fix
npm run format
```

## 11. Ghi chú bảo mật

- Không hard-code secret trong source code.
- Dùng biến môi trường cho JWT/DB/Redis.
- Với endpoint nhạy cảm (auth, refresh), bắt buộc giữ đúng middleware bảo mật và rate limit.
