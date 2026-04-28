# Discount Module

This module manages discount codes for the e-commerce platform. It follows a clean architecture pattern with domain-driven design.

## Features

- **Create Discounts**: Admin can create new discount codes with various configurations
- **Update Discounts**: Modify existing discount codes
- **Activate/Deactivate Discounts**: Soft delete by toggling the active status
- **List Discounts**: View all discounts with pagination
- **Find Discount**: Retrieve specific discount by ID or code
- **Validate Discount**: Check if a discount is valid for a given order amount and date
- **Calculate Discount**: Automatically calculate discount amount based on type and value

## Discount Types

- **Fixed**: A fixed amount discount (e.g., $5 off)
- **Percentage**: A percentage discount (e.g., 10% off)

## API Endpoints

### Public Endpoints

- `GET /discounts` - List all active discounts
- `GET /discounts/:discountId` - Get discount by ID
- `GET /discounts/code/:code` - Get discount by code
- `POST /discounts/check-validity` - Check if discount is valid and calculate amount

### Admin Endpoints (Protected by authentication)

- `POST /admin/discounts` - Create new discount
- `PATCH /admin/discounts/:discountId` - Update discount
- `PATCH /admin/discounts/:discountId/active` - Activate/Deactivate discount
- `GET /admin/discounts` - List all discounts (with filters)
- `GET /admin/discounts/:discountId` - Get discount by ID

## Request/Response Examples

### Create Discount

```json
POST /admin/discounts
{
  "name": "Summer Sale 2026",
  "discountCode": "SUMMER2026",
  "type": "percentage",
  "discountValue": 20,
  "minimumOrderValue": 50,
  "maximumDiscount": 100,
  "maximumUsage": 1000,
  "startTime": "2026-06-01T00:00:00Z",
  "endTime": "2026-08-31T23:59:59Z",
  "isActive": true,
  "allowSaveBefore": true
}
```

### Update Discount

```json
PATCH /admin/discounts/1
{
  "name": "Summer Sale Updated",
  "discountValue": 25,
  "maximumDiscount": 120,
  "endTime": "2026-09-30T23:59:59Z"
}
```

### Update Discount Active Status

```json
PATCH /admin/discounts/1/active
{
  "isActive": false
}

Response:
{
  "id": 1,
  "name": "Summer Sale 2026",
  "discountCode": "SUMMER20",
  "type": "percentage",
  "discountValue": 20,
  "minimumOrderValue": 50,
  "maximumDiscount": 100,
  "maximumUsage": 1000,
  "startTime": "2026-06-01T00:00:00Z",
  "endTime": "2026-08-31T23:59:59Z",
  "isActive": false,
  "allowSaveBefore": true
}
```

### Check Discount Validity

```json
POST /discounts/check-validity
{
  "discountCode": "SUMMER20",
  "orderAmount": 100,
  "currentDate": "2026-06-15T10:00:00Z"
}

Response:
{
  "discountAmount": 20,
  "finalAmount": 80,
  "isValid": true
}
```

## Database Schema

```sql
CREATE TABLE discount_codes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  discount_code VARCHAR(255) NOT NULL UNIQUE,
  type ENUM('fixed', 'percentage') NOT NULL,
  discount_value DECIMAL(12, 3) NOT NULL,
  minimum_order_value DECIMAL(12, 3) DEFAULT 0,
  maximum_discount DECIMAL(12, 3) NOT NULL,
  maximum_usage INT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  allow_save_before BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Module Structure

```
discount/
├── domain/
│   ├── domain.ts           # DiscountCode aggregate
│   ├── errors.ts           # Domain-specific errors
│   ├── interface.ts        # Repository interface
│   └── value_objects.ts    # Value objects (DiscountType)
├── application/
│   ├── dtos.ts            # Data Transfer Objects
│   ├── module_port.ts     # Module public interface
│   └── usecase/           # Use cases
│       ├── list-discounts.ts
│       ├── find-discount-by-id.ts
│       ├── find-discount-by-code.ts
│       ├── create-discount.ts
│       ├── update-discount.ts
│       ├── update-active-discount.ts
│       └── check-discount-validity.ts
├── infrastructure/
│   ├── discount-entity.ts  # TypeORM entity
│   └── repository.ts       # Repository implementation
├── presentation/
│   ├── controller.ts       # Express controller
│   ├── router.ts          # Express routes
│   └── validate.ts        # Zod validation schemas
├── module_adapter.ts       # Adapter pattern implementation
├── module.ts              # Module factory
├── tokens.ts              # DI tokens
└── container.ts           # Container (empty)
```

## Integration

To integrate this module into your app:

```typescript
// In src/app.ts or your main app file
import { discountModule } from '@/module/discount/module';

app.use('/api', discountModule.router);
```

## Error Handling

All errors inherit from `BadRequestError` and include meaningful messages:

- `DiscountNotFoundError` - Discount doesn't exist
- `DiscountExpiredError` - Discount validity period has ended
- `DiscountNotActiveError` - Discount is not active
- `DiscountNotStartedError` - Discount hasn't started yet
- `InvalidDiscountValueError` - Invalid discount value
- `InvalidTimeRangeError` - Start time after end time
- And more...

## Validation

Input validation is done using Zod schemas in `presentation/validate.ts`. All request data is validated before processing.
