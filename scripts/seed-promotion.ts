import { AppDataSource } from "@/config";
import { VariantEntity } from "@/module/product/infarstructure/productEntity";
import { PromotionStatusEnum, PromotionTypeEnum } from "@/module/promotion/domain/value_objects";
import { PromotionDetailEntity, PromotionProgramEntity } from "@/module/promotion/infrastructure/promotionEntity";

async function seedPromotion(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const programRepo = AppDataSource.getRepository(PromotionProgramEntity);
    const detailRepo = AppDataSource.getRepository(PromotionDetailEntity);
    const variantRepo = AppDataSource.getRepository(VariantEntity);

    /**
     * Delete existing promotion data
     */
    const existingPrograms = await programRepo.find({
      relations: ['details'],
    });

    if (existingPrograms.length > 0) {
      for (const program of existingPrograms) {
        await detailRepo.delete({ promotionProgramId: program.id });
      }
      await programRepo.delete({});
    }

    /**
     * Get available variants (should have data from seed-product)
     */
    const variants = await variantRepo.find({
      take: 20,
    });

    if (variants.length === 0) {
      throw new Error('❌ No variants found. Please run seed-product.ts first!');
    }

    /**
     * Create promotion program
     */
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const program = await programRepo.save(
      programRepo.create({
        name: '🔥 Summer Sale Campaign',
        startTime: now,
        endTime: nextWeek,
        status: PromotionStatusEnum.ACTIVE,
      })
    );

    /**
     * Add promotion details (discount for variants)
     */
    const promotionDetails = [];
    const valueOptions = [10, 15, 20, 5, 30, 25, 10, 15, 20, 10];

    for (let i = 0; i < Math.min(10, variants.length); i++) {
      promotionDetails.push(
        detailRepo.create({
          type: PromotionTypeEnum.PERCENTAGE,
          promotionValue: valueOptions[i],
          productLimit: 100,
          usageLimitPerCustomer: 2,
          promotionProgramId: program.id,
          variantId: variants[i].id,
        })
      );
    }

    await detailRepo.save(promotionDetails);

    console.log(`✅ Seed promotion hoàn tất! (${promotionDetails.length} details)`);
  } catch (error) {
    console.error('❌ Lỗi khi seed promotion:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

void seedPromotion().catch((err) => {
  console.error('❌ Seed promotion failed:', err);
  process.exit(1);
});