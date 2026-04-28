# Payment Module

Payment module handles payment processing integration with multiple payment gateways (VNPay, Momo, ZaloPay).

## Architecture

The module follows Domain-Driven Design (DDD) with clear separation of concerns:

### Domain Layer (`domain/`)

- **`value_objects.ts`** - Value objects and enums:
  - `PaymentGateway` - Supported gateways: vnpay, momo, zalopay
  - `PaymentStatus` - Status values: pending, processing, completed, failed, cancelled
  - `PaymentMethod` - Method types: card, wallet, bank_transfer
  - `PaymentAmount` - Immutable amount value object
  - `TransactionReference` - Unique transaction identifier
  - `GatewayTransactionId` - Gateway-provided transaction ID

- **`domain.ts`** - Core entities:
  - `PaymentRequest` - Represents a payment request
  - `PaymentResponse` - Gateway payment response
  - `PaymentTransactionHistory` - Payment state transitions

- **`errors.ts`** - Domain-specific errors

### Application Layer (`application/`)

- **`dtos.ts`** - Data Transfer Objects for all operations
- **`module_port.ts`** - Public API interface
- **`gateway_service.ts`** - Gateway service and storage interfaces
- **`usecase/`** - Use cases:
  - `InitiatePaymentUseCase` - Create payment and get payment URL
  - `HandlePaymentCallbackUseCase` - Process gateway callbacks
  - `GetPaymentStatusUseCase` - Check payment status
  - `GetPaymentHistoryUseCase` - Retrieve payment history

### Presentation Layer (`presentation/`)

- **`router.ts`** - Express routes
- **`controller.ts`** - Request handlers
- **`validate.ts`** - Zod validation schemas

### Infrastructure Layer (`infrastructure/`)

- **`vnpay-gateway.ts`** - VNPay gateway implementation
- **`momo-gateway.ts`** - Momo gateway implementation
- **`zalopay-gateway.ts`** - ZaloPay gateway implementation
- **`payment-storage.ts`** - In-memory storage (production: use database)

## API Endpoints

### Public Endpoints (Require Authentication)

#### POST `/api/v1/payments/initiate`

Initiate a payment request with specified gateway.

**Request Body:**
```json
{
  "orderId": 123,
  "gateway": "vnpay",
  "method": "card",
  "amount": 1000000,
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paygate?...",
    "transactionRef": "vnpay-123-1234567890",
    "gateway": "vnpay",
    "gatewayTransactionId": "vnpay-123-1234567890",
    "metadata": {
      "gateway": "vnpay",
      "initiatedAt": "2026-04-27T10:00:00.000Z"
    }
  }
}
```

#### GET `/api/v1/payments/status/:transactionRef`

Check current payment status.

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionRef": "vnpay-123-1234567890",
    "status": "completed",
    "gateway": "vnpay",
    "amount": 1000000,
    "orderId": 123,
    "createdAt": "2026-04-27T10:00:00.000Z",
    "updatedAt": "2026-04-27T10:05:00.000Z"
  }
}
```

#### GET `/api/v1/payments/history/:transactionRef`

Retrieve payment transaction history.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "transactionRef": "vnpay-123-1234567890",
    "status": "completed",
    "gateway": "vnpay",
    "amount": 1000000,
    "orderId": 123,
    "history": [
      {
        "status": "pending",
        "responseCode": "00",
        "message": "Transaction initiated",
        "timestamp": "2026-04-27T10:00:00.000Z"
      },
      {
        "status": "processing",
        "responseCode": "00",
        "message": "Processing payment",
        "timestamp": "2026-04-27T10:02:00.000Z"
      },
      {
        "status": "completed",
        "responseCode": "00",
        "message": "Payment successful",
        "timestamp": "2026-04-27T10:05:00.000Z"
      }
    ]
  }
}
```

### Webhook Endpoints (No Authentication Required)

#### POST `/api/v1/payments/callback`

Handle payment gateway callbacks.

**Request Body (example from VNPay):**
```json
{
  "gateway": "vnpay",
  "transactionRef": "vnpay-123-1234567890",
  "gatewayTransactionId": "vnpay-123-1234567890",
  "status": "completed",
  "responseCode": "00",
  "message": "Giao dịch thành công",
  "metadata": {
    "vnp_Amount": "1000000",
    "vnp_BankCode": "NCB"
  }
}
```

## Configuration

Add the following environment variables to `.env`:

```env
# VNPay Configuration
VNPAY_URL=https://sandbox.vnpayment.vn/paygate
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret

# Momo Configuration
MOMO_URL=https://test-payment.momo.vn/v3/gateway
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key

# ZaloPay Configuration
ZALOPAY_URL=https://sandbox.zalopay.vn/api/v2/create
ZALOPAY_APP_ID=your_app_id
ZALOPAY_KEY1=your_key1
ZALOPAY_KEY2=your_key2

# Application URL
APP_URL=http://localhost:3000
```

## Gateway Integration Details

### VNPay Integration

- **Sandbox URL:** https://sandbox.vnpayment.vn/paygate
- **Production URL:** https://api.vnpayment.vn/paygate
- **Documentation:** https://sandbox.vnpayment.vn/

### Momo Integration

- **Sandbox URL:** https://test-payment.momo.vn/v3/gateway
- **Production URL:** https://payment.momo.vn/v3/gateway
- **Documentation:** https://developers.momo.vn/

### ZaloPay Integration

- **Sandbox URL:** https://sandbox.zalopay.vn/api/v2/create
- **Production URL:** https://api.zalopay.vn/api/v2/create
- **Documentation:** https://developers.zalopay.vn/

## Error Handling

The module throws domain-specific errors:

- `InvalidPaymentGatewayError` - Invalid or unsupported gateway
- `InvalidPaymentMethodError` - Invalid payment method
- `InvalidPaymentAmountError` - Invalid amount
- `PaymentInitiationFailedError` - Gateway payment initiation failed
- `PaymentCallbackValidationError` - Invalid callback signature
- `TransactionNotFoundError` - Transaction not found
- `InvalidCallbackDataError` - Invalid callback data

## Storage Implementation

Currently uses in-memory storage (`InMemoryPaymentStorage`) for development. For production:

1. Implement `IPaymentStorage` interface with database persistence
2. Update `PaymentModule` to use database storage
3. Create database migrations for payment tables

Example tables needed:
- `payment_requests` - Payment requests
- `payment_history` - Transaction history

## Future Enhancements

- [ ] Database persistence layer
- [ ] Real API integration with gateways
- [ ] Payment reconciliation
- [ ] Refund handling
- [ ] Payment analytics and reporting
- [ ] Webhook signature verification
- [ ] Rate limiting
- [ ] Circuit breaker pattern for gateway calls
- [ ] Idempotency keys for duplicate prevention
