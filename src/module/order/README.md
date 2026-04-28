# Order Module

This module manages customer orders for the e-commerce platform. It follows a clean architecture pattern with domain-driven design.

## Features

- **Create Orders**: Users can create new orders with items and shipping information
- **List Orders**: View orders with pagination and filtering
- **Find Order**: Retrieve specific order by ID
- **Update Order Status**: Admin can update order status (pending, confirmed, shipping, delivered, cancelled)
- **Update Order Payment**: Update payment information and status
- **Order Items Tracking**: Track product variants and pricing at order creation time
- **Order Status History**: Maintain complete audit trail of status changes
- **Discount Application**: Apply discount codes to orders and calculate final amount
- **Order Validation Checks**: Verify if orders exist for specific accounts, shipping info, or discount codes

## Order Statuses

- **pending** - Order created, awaiting confirmation
- **confirmed** - Order confirmed by admin
- **shipping** - Order is in transit
- **delivered** - Order delivered successfully
- **cancelled** - Order cancelled

## Payment Methods

- **cash_on_delivery** - Payment upon delivery
- **bank_transfer** - Direct bank transfer payment

## API Endpoints

### Public Endpoints (User)

- `GET /orders` - List all orders of authenticated user
- `GET /orders/:orderId` - Get order by ID
- `POST /orders` - Create new order
- `PATCH /orders/:orderId/payment` - Update order payment

### Admin Endpoints (Protected by authentication)

- `GET /admin/orders` - List all orders (with filters)
- `GET /admin/orders/:orderId` - Get order by ID
- `PATCH /admin/orders/:orderId/status` - Update order status
- `GET /admin/orders/check/account/:accountId` - Check if account has orders
- `GET /admin/orders/check/shipping-info/:shippingInfoId` - Check if shipping info has orders
- `GET /admin/orders/check/discount-code/:discountCodeId` - Check if discount code has orders

## Request/Response Examples

### Create Order

```json
POST /orders
{
  "accountId": 1,
  "shippingInfoId": 1,
  "paymentMethod": "cash_on_delivery",
  "shippingFee": 30000,
  "discountCodeId": 1,
  "note": "Please delivery in the morning",
  "items": [
    {
      "variantId": 1,
      "quantity": 2
    },
    {
      "variantId": 3,
      "quantity": 1
    }
  ]
}

Response:
{
  "id": 1,
  "status": "pending",
  "orderDate": "2026-04-27T10:30:00Z",
  "totalProductAmount": 500000,
  "shippingFee": 30000,
  "discountAmount": 50000,
  "totalAmount": 480000,
  "isPaid": false,
  "paymentMethod": "cash_on_delivery",
  "bankTransferTime": null,
  "bankTransferTransactionCode": null,
  "note": "Please delivery in the morning",
  "accountId": 1,
  "shippingInfoId": 1,
  "discountCodeId": 1,
  "items": [
    {
      "id": 1,
      "productNameSnapshot": "iPhone 14 Pro",
      "variantNameSnapshot": "iPhone 14 Pro - Black",
      "priceBeforeDiscount": 250000,
      "priceAfterDiscount": 250000,
      "quantity": 2,
      "totalAmount": 500000
    }
  ],
  "histories": [
    // {
    //   "id": 1,
    //   "oldStatus": "pending",
    //   "newStatus": "pending",
    //   "note": "Order created",
    //   "changedAt": "2026-04-27T10:30:00Z"
    // }
  ]
}
```

### Update Order Status

```json
PATCH /admin/orders/1/status
{
  "status": "confirmed",
  "note": "Order confirmed and ready to ship"
}

Response:
{
  "id": 1,
  "status": "confirmed",
  "orderDate": "2026-04-27T10:30:00Z",
  "totalProductAmount": 500000,
  "shippingFee": 30000,
  "discountAmount": 50000,
  "totalAmount": 480000,
  "isPaid": false,
  "paymentMethod": "cash_on_delivery",
  "bankTransferTime": null,
  "bankTransferTransactionCode": null,
  "note": "Please delivery in the morning",
  "accountId": 1,
  "shippingInfoId": 1,
  "discountCodeId": 1
}
```

### Update Order Payment

```json
PATCH /orders/1/payment
{
  "isPaid": true,
  "paymentMethod": "bank_transfer",
  "bankTransferTime": "2026-04-27T10:45:00Z",
  "bankTransferTransactionCode": "VCB123456789"
}

Response:
{
  "id": 1,
  "status": "pending",
  "orderDate": "2026-04-27T10:30:00Z",
  "totalProductAmount": 500000,
  "shippingFee": 30000,
  "discountAmount": 50000,
  "totalAmount": 480000,
  "isPaid": true,
  "paymentMethod": "bank_transfer",
  "bankTransferTime": "2026-04-27T10:45:00Z",
  "bankTransferTransactionCode": "VCB123456789",
  "note": "Please delivery in the morning",
  "accountId": 1,
  "shippingInfoId": 1,
  "discountCodeId": 1
}
```

### List Orders with Filters

```json
GET /admin/orders?page=1&limit=20&accountId=1&status=pending&sortBy=orderDate&sortOrder=desc

Response:
{
  "items": [
    {
      "id": 1,
      "status": "pending",
      "orderDate": "2026-04-27T10:30:00Z",
      "totalProductAmount": 500000,
      "shippingFee": 30000,
      "discountAmount": 50000,
      "totalAmount": 480000,
      "isPaid": false,
      "paymentMethod": "cash_on_delivery",
      "note": "Please delivery in the morning",
      "accountId": 1,
      "shippingInfoId": 1,
      "discountCodeId": 1
    }
  ],
  "page": 1,
  "limit": 20,
  "totalItems": 1,
  "totalPages": 1
}
```

### Check If Account Has Orders

```json
GET /admin/orders/check/account/1

Response:
{
  "exists": true
}
```

## Order Item Details

When creating an order, the system captures a snapshot of:

- Product name at the time of order
- Variant name (with specifications)
- Price before discount
- Price after discount
- Quantity ordered

This ensures price history and product details are preserved even if they change later.

## Order Status History

Each order maintains a complete history of all status changes with:

- Previous status
- New status
- Change timestamp
- Optional note about the change

This provides full traceability and audit trail for order lifecycle management.

- `InvalidOrderDataError`

## Validation

Validation is handled using Zod schemas in `presentation/validate.ts`.
