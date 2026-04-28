# Payment Module

This module handles all payment operations for the e-commerce platform. It supports multiple payment methods and ensures secure, traceable, and testable transactions.

---

## Features

- Multiple payment methods: COD, VNPay, MoMo, ZaloPay
- Payment status tracking (`isPaid`)
- Transaction metadata storage (transaction code, payment time)
- Secure callback / webhook handling from payment gateways
- Sandbox support for testing without real transactions
- Clean architecture & easy extensibility

---

## Payment Methods

---

### 1. Cash On Delivery (COD)

#### Description

- Customer pays when receiving the order
- No external payment gateway required
- Simplest and most reliable fallback payment method

#### Flow

1. User creates order:

   ```json
   {
     "paymentMethod": "cash_on_delivery"
   }
   ```

2. System automatically sets:
   - `isPaid = false`

3. Order is processed and shipped
4. When order is delivered:
   - Admin confirms payment manually
   - Update `isPaid = true`

#### How to Test

1. Create order:

   ```http
   POST /orders
   ```

   ```json
   {
     "paymentMethod": "cash_on_delivery"
   }
   ```

2. Simulate delivery:

   ```http
   PATCH /admin/orders/:orderId/status
   ```

   ```json
   {
     "status": "delivered"
   }
   ```

3. Confirm payment:

   ```http
   PATCH /orders/:orderId/payment
   ```

   ```json
   {
     "isPaid": true
   }
   ```

#### Notes

- No transaction code required
- No callback or webhook
- Fully controlled internally

---

### 2. VNPay

#### Description

- Vietnamese payment gateway
- Supports ATM cards, QR Pay, mobile banking
- Redirect-based payment flow

#### Flow

1. Backend generates VNPay payment URL
2. Frontend redirects user to VNPay
3. User completes payment
4. VNPay redirects back (`returnUrl`)
5. VNPay calls server (`ipnUrl`)
6. Backend verifies secure hash
7. Update order payment status

#### Important Fields

| Field            | Description            |
| ---------------- | ---------------------- |
| vnp_TxnRef       | Order ID               |
| vnp_Amount       | Payment amount         |
| vnp_ResponseCode | Payment result         |
| vnp_SecureHash   | Signature verification |

---

#### How to Test (Sandbox)

1. Use VNPay sandbox URL:

   ```
   https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
   ```

2. Configure environment:

   ```
   vnp_TmnCode=YOUR_TMN_CODE
   vnp_HashSecret=YOUR_SECRET
   vnp_ReturnUrl=http://localhost:3000/payment/vnpay-return
   vnp_IpnUrl=http://localhost:3000/payment/vnpay-ipn
   ```

3. Test card:

   ```
   Bank: NCB
   Card number: 9704198526191432198
   Name: NGUYEN VAN A
   Exp date: 07/15
   OTP: 123456
   ```

4. Steps:
   - Call API create payment URL
   - Redirect user
   - Complete payment
   - Verify backend receives IPN
   - Check order updated:

     ```json
     {
       "isPaid": true
     }
     ```

#### Docs

- https://sandbox.vnpayment.vn/apis/docs/en.html

---

### 3. MoMo

#### Description

- Popular e-wallet in Vietnam
- Supports QR, redirect, mobile app payment
- Requires request signing

#### Flow

1. Backend creates payment request (signed)
2. MoMo returns `payUrl`
3. Redirect user to MoMo
4. User completes payment
5. MoMo calls `notifyUrl` (webhook)
6. Backend verifies signature
7. Update order

---

#### Important Fields

| Field      | Description         |
| ---------- | ------------------- |
| orderId    | Order ID            |
| requestId  | Unique request ID   |
| resultCode | Payment result      |
| signature  | Security validation |

---

#### How to Test (Sandbox)

1. Endpoint:

   ```
   https://test-payment.momo.vn/v2/gateway/api/create
   ```

2. Config:

   ```
   partnerCode=YOUR_PARTNER_CODE
   accessKey=YOUR_ACCESS_KEY
   secretKey=YOUR_SECRET_KEY
   ```

3. Steps:
   - Call create payment API
   - Receive `payUrl`
   - Redirect user
   - Complete payment
   - Receive webhook
   - Verify signature
   - Update:

     ```json
     {
       "isPaid": true
     }
     ```

#### Docs

- https://developers.momo.vn

---

### 4. ZaloPay

#### Description

- Payment gateway by Zalo
- Supports QR and app-based payments
- Requires HMAC verification

#### Flow

1. Backend creates order via API
2. Receive `order_url` or `qr_code`
3. User pays
4. ZaloPay sends callback
5. Backend verifies MAC
6. Update order

---

#### Important Fields

| Field        | Description            |
| ------------ | ---------------------- |
| app_trans_id | Unique transaction ID  |
| zp_trans_id  | ZaloPay transaction    |
| mac          | Signature verification |

---

#### How to Test (Sandbox)

1. Endpoint:

   ```
   https://sb-openapi.zalopay.vn/v2/create
   ```

2. Config:

   ```
   app_id=YOUR_APP_ID
   key1=YOUR_KEY1
   key2=YOUR_KEY2
   ```

3. Steps:
   - Create order
   - Open `order_url`
   - Simulate payment
   - Receive callback
   - Verify MAC
   - Update:

     ```json
     {
       "isPaid": true
     }
     ```

#### Docs

- https://docs.zalopay.vn

---

## Payment API Endpoints

### User

- `PATCH /orders/:orderId/payment`
  Update payment manually (COD or fallback)

---

### Gateway Callbacks

- `POST /payments/vnpay/ipn`
- `POST /payments/momo/webhook`
- `POST /payments/zalopay/callback`

---

## Payment Data Model

```json
{
  "isPaid": true,
  "paymentMethod": "vnpay",
  "paymentTime": "2026-04-27T10:45:00Z",
  "transactionCode": "ABC123XYZ"
}
```

---

## Security Notes

- Always verify signatures (VNPay, MoMo, ZaloPay)
- Never trust frontend payment result
- Use environment variables for secrets
- Log all transactions for auditing

---

## Common Errors

| Error              | Cause              |
| ------------------ | ------------------ |
| Invalid signature  | Wrong secret key   |
| Order not found    | Invalid orderId    |
| Duplicate callback | Retry from gateway |
| Amount mismatch    | Tampered request   |

---

## Best Practices

- Use idempotency for callbacks
- Validate amount before updating payment
- Store raw gateway response for debugging
- Separate payment service from order service

---

## Future Improvements

- Refund API integration
- Partial payment support
- Subscription payments
- Multi-currency support
- Payment retry & failure recovery

---
