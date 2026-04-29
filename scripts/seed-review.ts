import { AppDataSource } from '../src/config/database';
import { AccountEntity } from '../src/module/auth/infarstructure/accountEntity';
import { ReviewEntity } from '../src/module/review/infrastructure/reviewEntity';

type ReviewSeedRow = {
  orderId: number;
  productId: number;
  rating: number;
  content: string;
};

async function seedReview(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const accountRepo = AppDataSource.getRepository(AccountEntity);
    const reviewRepo = AppDataSource.getRepository(ReviewEntity);

    const account = await accountRepo.findOne({
      where: { phoneNum: '0286257634' },
    });

    if (!account) {
      throw new Error('Seed account not found. Run seed-user.ts first.');
    }

    await reviewRepo.delete({ accountId: account.id });

    const reviewRows = (await AppDataSource.query(
      `
      SELECT DISTINCT
        oi.order_id AS "orderId",
        p.id AS "productId",
        p.name AS "productName"
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
      INNER JOIN variants v ON v.id = oi.variant_id
      INNER JOIN products p ON p.id = v.product_id
      WHERE o.account_id = $1
      ORDER BY oi.order_id ASC, p.id ASC
      LIMIT 10
      `,
      [account.id]
    )) as Array<{
      orderId: number;
      productId: number;
      productName: string;
    }>;

    if (reviewRows.length === 0) {
      throw new Error('No order items found. Run seed-order.ts first.');
    }

    const seedRows: ReviewSeedRow[] = reviewRows.map((row, index) => {
      return {
        orderId: Number(row.orderId),
        productId: Number(row.productId),
        rating: [5, 4, 5, 3, 4, 2, 5, 4, 3, 5][index],
        content: `Seed review ${index + 1} for ${row.productName}`,
      };
    });

    await reviewRepo.save(
      seedRows.map((seed) =>
        reviewRepo.create({
          productId: seed.productId,
          accountId: account.id,
          orderId: seed.orderId,
          rating: seed.rating,
          content: seed.content,
          sellerRating: null,
          shippingRating: null,
        })
      )
    );

    console.log(`✅ Seed reviews completed! (${seedRows.length} reviews)`);
  } catch (error) {
    console.error('❌ Seed review failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

void seedReview().catch((error) => {
  console.error('❌ Seed review failed:', error);
  process.exit(1);
});
