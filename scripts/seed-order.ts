import { AppDataSource } from '../src/config/database';
import {
  OrderEntity,
  OrderItemEntity,
  OrderStatusHistoryEntity,
} from '../src/module/order/infrastructure/order-entity';
import { VariantEntity } from '../src/module/product/infarstructure/productEntity';
import { AccountEntity } from '../src/module/auth/infarstructure/accountEntity';
import { DiscountCodeEntity } from '../src/module/discount/infrastructure/discount-entity';
import {
  ORDER_STATUS_VALUE,
  OrderStatus,
  PAYMENT_METHOD_VALUE,
} from '../src/module/order/domain/value_objects';
import { DISCOUNT_TYPE_VALUE } from '../src/module/discount/domain/value_objects';

async function seedOrder(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const orderRepo = AppDataSource.getRepository(OrderEntity);
    const orderItemRepo = AppDataSource.getRepository(OrderItemEntity);
    const orderHistoryRepo = AppDataSource.getRepository(OrderStatusHistoryEntity);
    const variantRepo = AppDataSource.getRepository(VariantEntity);
    const accountRepo = AppDataSource.getRepository(AccountEntity);
    const discountRepo = AppDataSource.getRepository(DiscountCodeEntity);

    /**
     * CLEAN DATA
     */
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(`DELETE FROM order_status_histories`);
      await queryRunner.query(`DELETE FROM order_items`);
      await queryRunner.query(`DELETE FROM orders`);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    /**
     * PREPARE DATA
     */
    const account = await accountRepo.findOne({
      where: { phoneNum: '0286257634' },
    });
    if (!account) throw new Error('Seed account not found');

    const variants = await variantRepo.find({
      relations: ['product', 'details', 'details.value', 'details.value.group'],
    });
    if (variants.length < 3) throw new Error('Not enough variants');

    const discounts = await discountRepo.find({
      where: { isActive: true },
    });

    /**
     * HELPER
     */
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    /**
     * CREATE ORDERS WITH DIFFERENT STATES
     */
    const orderStates = [
      {
        name: 'Pending Order',
        status: ORDER_STATUS_VALUE.PENDING,
        statusHistory: [
          { oldStatus: 'pending' as OrderStatus, newStatus: ORDER_STATUS_VALUE.PENDING, note: 'Order created' },
        ],
      },
      {
        name: 'Confirmed Order',
        status: ORDER_STATUS_VALUE.CONFIRMED,
        statusHistory: [
          { oldStatus: 'pending' as OrderStatus, newStatus: ORDER_STATUS_VALUE.PENDING, note: 'Order created' },
          { oldStatus: ORDER_STATUS_VALUE.PENDING, newStatus: ORDER_STATUS_VALUE.CONFIRMED, note: 'Order confirmed' },
        ],
      },
      {
        name: 'Shipping Order',
        status: ORDER_STATUS_VALUE.SHIPPING,
        statusHistory: [
          { oldStatus: 'pending' as OrderStatus, newStatus: ORDER_STATUS_VALUE.PENDING, note: 'Order created' },
          { oldStatus: ORDER_STATUS_VALUE.PENDING, newStatus: ORDER_STATUS_VALUE.CONFIRMED, note: 'Order confirmed' },
          { oldStatus: ORDER_STATUS_VALUE.CONFIRMED, newStatus: ORDER_STATUS_VALUE.SHIPPING, note: 'Order shipped' },
        ],
      },
      {
        name: 'Delivered Order',
        status: ORDER_STATUS_VALUE.DELIVERED,
        statusHistory: [
          { oldStatus: 'pending' as OrderStatus, newStatus: ORDER_STATUS_VALUE.PENDING, note: 'Order created' },
          { oldStatus: ORDER_STATUS_VALUE.PENDING, newStatus: ORDER_STATUS_VALUE.CONFIRMED, note: 'Order confirmed' },
          { oldStatus: ORDER_STATUS_VALUE.CONFIRMED, newStatus: ORDER_STATUS_VALUE.SHIPPING, note: 'Order shipped' },
          { oldStatus: ORDER_STATUS_VALUE.SHIPPING, newStatus: ORDER_STATUS_VALUE.DELIVERED, note: 'Order delivered' },
        ],
      },
      {
        name: 'Reviewed Order',
        status: ORDER_STATUS_VALUE.REVIEWED,
        statusHistory: [
          { oldStatus: 'pending' as OrderStatus, newStatus: ORDER_STATUS_VALUE.PENDING, note: 'Order created' },
          { oldStatus: ORDER_STATUS_VALUE.PENDING, newStatus: ORDER_STATUS_VALUE.CONFIRMED, note: 'Order confirmed' },
          { oldStatus: ORDER_STATUS_VALUE.CONFIRMED, newStatus: ORDER_STATUS_VALUE.SHIPPING, note: 'Order shipped' },
          { oldStatus: ORDER_STATUS_VALUE.SHIPPING, newStatus: ORDER_STATUS_VALUE.DELIVERED, note: 'Order delivered' },
          { oldStatus: ORDER_STATUS_VALUE.DELIVERED, newStatus: ORDER_STATUS_VALUE.REVIEWED, note: 'Customer reviewed' },
        ],
      },
      {
        name: 'Cancelled Order',
        status: ORDER_STATUS_VALUE.CANCELLED,
        statusHistory: [
          { oldStatus: 'pending' as OrderStatus, newStatus: ORDER_STATUS_VALUE.PENDING, note: 'Order created' },
          { oldStatus: ORDER_STATUS_VALUE.PENDING, newStatus: ORDER_STATUS_VALUE.CANCELLED, note: 'Order cancelled by customer' },
        ],
      },
    ];

    for (let i = 0; i < orderStates.length; i++) {
      const orderState = orderStates[i];
      const selectedVariants = [randomItem(variants), randomItem(variants)];

      let totalProductAmount = 0;
      const orderItems = [];

      for (const variant of selectedVariants) {
        const quantity = random(1, 3);
        const price = variant.price;
        const total = price * quantity;

        totalProductAmount += total;

        orderItems.push({
          variant,
          quantity,
          price,
          total,
        });
      }

      /**
       * APPLY DISCOUNT (random)
       */
      let discountAmount = 0;
      let discountCodeId: number | null = null;

      if (discounts.length > 0 && Math.random() > 0.5) {
        const discount = randomItem(discounts);
        discountCodeId = discount.id;

        if (discount.type === DISCOUNT_TYPE_VALUE.FIXED) {
          discountAmount = discount.discountValue;
        } else if (discount.type === DISCOUNT_TYPE_VALUE.PERCENTAGE) {
          discountAmount = (totalProductAmount * discount.discountValue) / 100;
        }

        if (discount.maximumDiscount) {
          discountAmount = Math.min(discountAmount, discount.maximumDiscount);
        }
      }

      const shippingFee = 30000;
      const finalTotal = totalProductAmount + shippingFee - discountAmount;

      /**
       * CREATE ORDER
       */
      const order = await orderRepo.save(
        orderRepo.create({
          status: orderState.status,
          orderDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          totalProductAmount,
          shippingFee,
          discountAmount,
          totalAmount: finalTotal,
          isPaid: orderState.status !== ORDER_STATUS_VALUE.CANCELLED ? Math.random() > 0.3 : false,
          paymentMethod: randomItem([
            PAYMENT_METHOD_VALUE.CASH_ON_DELIVERY,
            PAYMENT_METHOD_VALUE.VNPAY_WALLET,
            PAYMENT_METHOD_VALUE.MOMO_WALLET,
            PAYMENT_METHOD_VALUE.ZALOPAY_WALLET,
          ]),
          note: `Seed ${orderState.name} #${i + 1}`,
          accountId: account.id,
          shippingInfoId: 1,
          discountCodeId,
        })
      );

      /**
       * SAVE ITEMS
       */
      await orderItemRepo.save(
        orderItems.map((item) =>
          orderItemRepo.create({
            orderId: order.id,
            variantId: item.variant.id,
            productNameSnapshot: item.variant.product.name,
            variantNameSnapshot: item.variant.details
              .sort((a, b) => a.value.group.displayOrder - b.value.group.displayOrder)
              .map((detail) => detail.value.value)
              .join(' / '),
            priceBeforeDiscount: item.price,
            priceAfterDiscount: item.price,
            quantity: item.quantity,
            totalAmount: item.total,
          })
        )
      );

      /**
       * CREATE STATUS HISTORY
       */
      await orderHistoryRepo.save(
        orderState.statusHistory.map((h, index) =>
          orderHistoryRepo.create({
            orderId: order.id,
            oldStatus: h.oldStatus,
            newStatus: h.newStatus,
            note: h.note,
            changedAt: new Date(Date.now() - (orderState.statusHistory.length - index) * 60 * 60 * 1000),
          })
        )
      );

      console.log(`✅ Created ${orderState.name}`);
    }

    console.log('='.repeat(50));
    console.log(`✅ Seed orders completed! (${orderStates.length} orders with different states)`);
    console.log('='.repeat(50));
  } finally {
    await AppDataSource.destroy();
  }
}

void seedOrder().catch((error) => {
  console.error('❌ Seed order failed:', error);
  process.exit(1);
});
