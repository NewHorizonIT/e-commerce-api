import { AppDataSource } from '../src/config/database';
import {
  OrderEntity,
  OrderItemEntity,
  OrderStatusHistoryEntity,
} from '../src/module/order/infrastructure/order-entity';
import { VariantEntity } from '../src/module/product/infarstructure/productEntity';
import { AccountEntity } from '../src/module/auth/infarstructure/accountEntity';
import { ORDER_STATUS_VALUE, PAYMENT_METHOD_VALUE } from '../src/module/order/domain/value_objects';

async function seedOrder(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const orderRepo = AppDataSource.getRepository(OrderEntity);
    const orderItemRepo = AppDataSource.getRepository(OrderItemEntity);
    const orderHistoryRepo = AppDataSource.getRepository(OrderStatusHistoryEntity);
    const variantRepo = AppDataSource.getRepository(VariantEntity);
    const accountRepo = AppDataSource.getRepository(AccountEntity);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /***
       * CLEAN OLD ORDER DATA (optional)
       */
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

    /***
     * CREATE ORDER
     */
    const account = await accountRepo.findOne({
      where: { phoneNum: '0912345678' },
    });
    if (!account) throw new Error('Seed account not found');

    const variants = await variantRepo.find({
      relations: ['product'], // ⚠️ bắt buộc
    });
    if (variants.length < 2) throw new Error('Not enough variants');

    const order = await orderRepo.save(
      orderRepo.create({
        status: ORDER_STATUS_VALUE.PENDING,
        orderDate: new Date(),
        totalProductAmount: 0,
        shippingFee: 30000,
        discountAmount: 50000,
        totalAmount: 0,
        isPaid: false,
        paymentMethod: PAYMENT_METHOD_VALUE.CASH_ON_DELIVERY,
        note: 'Seed order for testing',
        accountId: account.id,
        shippingInfoId: 1, // ⚠️ phải tồn tại
        discountCodeId: null,
      })
    );

    const itemsData = [
      { variant: variants[0], quantity: 1 },
      { variant: variants[1], quantity: 2 },
    ];

    let totalProductAmount = 0;
    const orderItems = [];

    for (const item of itemsData) {
      const price = item.variant.price;
      const total = price * item.quantity;

      totalProductAmount += total;

      orderItems.push(
        orderItemRepo.create({
          orderId: order.id,
          variantId: item.variant.id,
          productNameSnapshot: item.variant.product.name,
          variantNameSnapshot: item.variant.product.name, // TODO: improve
          priceBeforeDiscount: price,
          priceAfterDiscount: price,
          quantity: item.quantity,
          totalAmount: total,
        })
      );
    }

    const finalTotal = totalProductAmount + order.shippingFee - order.discountAmount;

    await orderRepo.update(order.id, {
      totalProductAmount,
      totalAmount: finalTotal,
    });

    await orderItemRepo.save(orderItems);

    await orderHistoryRepo.save([
      orderHistoryRepo.create({
        orderId: order.id,
        oldStatus: ORDER_STATUS_VALUE.PENDING,
        newStatus: ORDER_STATUS_VALUE.PENDING,
        note: 'Order created',
        changedAt: new Date(),
      }),
    ]);

    console.log('Order seed completed successfully.');
  } finally {
    await AppDataSource.destroy();
  }
}

void seedOrder().catch((error) => {
  console.error('Seed order failed:', error);
  process.exit(1);
});
