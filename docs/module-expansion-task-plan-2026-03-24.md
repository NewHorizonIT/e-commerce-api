# Module Expansion Task Plan (Team 3)

## 1. Phạm vi MVP

- Module 1: Cart
- Module 2: Voucher
- Module 3: Order
- Module 4: Payment
- Module 5: Rating
- Module 6: Feedback

## 2. Nguyên tắc phân công

- Follow đúng module guide: presentation -> application -> domain -> infrastructure, có update Swagger.

## 3. Khối lượng cân bằng

| Thành viên | Ownership chính   | Story Point | Cross-task bắt buộc                          |
| ---------- | ----------------- | ----------- | -------------------------------------------- |
| Quy        | Cart + Voucher    | 13          | Integration test + checkout flow review      |
| Ân         | Order + Payment   | 13          | DB migration owner + transaction consistency |
| Sơn        | Rating + Feedback | 13          | Swagger owner + API contract review          |

## 4. Task chi tiết theo từng người

### Quy - Cart + Voucher (Owner)

- [ ] Tạo skeleton module cart theo khung module guide.
- [ ] Xây dựng domain object cho cart item (add/update/remove, validate quantity > 0).
- [ ] Repository cho Cart, CartItemDetail, query theo account.
- [ ] Usecase:
  - [ ] Add item vào cart
  - [ ] Update quantity
  - [ ] Remove item
  - [ ] Get current cart
  - [ ] Apply voucher preview (chỉ tính toán, chưa lock đơn)
- [ ] Presentation:
  - [ ] Router/controller/validate cho `/api/v1/cart/*`
  - [ ] Endpoint apply voucher preview `/api/v1/cart/voucher/preview`
- [ ] Unit test cho usecase quantity, duplicate item merge, stock check.
- [ ] Phối hợp Ân test checkout handoff (cart -> order).

Deliverable chính:

- `src/module/cart/**`
- `src/module/voucher/**`
- update `src/app.ts`
- update `docs/swagger.yml`

### Ân - Order + Payment (Owner)

- [ ] Tạo skeleton module order.
- [ ] Chuẩn hóa status flow: pending -> confirmed -> shipping -> delivered -> reviewed/cancelled.
- [ ] Repository cho Order, OrderItem, OrderStatusHistory.
- [ ] Usecase:
  - [ ] Place order từ cart snapshot
  - [ ] Calculate total/shipping/discount
  - [ ] Update status có ghi lịch sử
  - [ ] Payment mark-paid (COD + bank transfer metadata)
- [ ] Transaction boundary:
  - [ ] Đặt order + order item + trừ stock trong 1 transaction
  - [ ] Idempotency key cho submit order (tránh tạo đơn trùng)
- [ ] Presentation:
  - [ ] Router/controller/validate cho `/api/v1/orders/*`
  - [ ] Payment endpoint `/api/v1/orders/:id/payment`
- [ ] Integration test order flow với dữ liệu cart + voucher.

Deliverable chính:

- `src/module/order/**`
- `src/module/payment/*`
- migration liên quan order
- update `docs/swagger.yml`

### Sơn - Rating + Feedback (Owner)

- [ ] Tạo skeleton module review.
- [ ] Domain rule:
  - [ ] Chỉ được review khi order đã delivered
  - [ ] Mỗi (account, product, order) tối đa 1 review
  - [ ] Rating range 1..5
- [ ] Repository cho ProductReview + query aggregate rating theo product.
- [ ] Usecase:
  - [ ] Create review
  - [ ] Update review (trong cửa sổ cho phép)
  - [ ] List review theo product (phân trang)
  - [ ] Get rating summary (avg, count)
- [ ] Presentation:
  - [ ] Router/controller/validate cho `/api/v1/reviews/*`
- [ ] Swagger owner:
  - [ ] Chuẩn hóa response/error contract cho 3 module mới
  - [ ] Verify request schema examples
- [ ] Contract test cho review + rating summary.

Deliverable chính:

- `src/module/review/**`
- update `docs/swagger.yml`
- test cases contract

## 5. Shared tasks (chia đều)

- [ ] Register module dependency vào composition root/module wiring.
- [ ] Update DB datasource entities cho module mới.
- [ ] Chạy checklist trước PR:
  - [ ] build/typecheck/lint pass
  - [ ] Swagger update đầy đủ
  - [ ] success + invalid input + unauthorized + not found

## 6. Định nghĩa Done

- Có route + validate + controller + usecase + repository hoạt động end-to-end.
- Error code ổn định, không throw raw Error trong usecase/domain.
- Swagger endpoint mới đầy đủ request/response/error.
- Đã được 1 thành viên khác review và approve.
