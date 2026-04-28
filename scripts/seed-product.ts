import { AppDataSource } from '../src/config/database';
import { hashPassword } from '../src/shared/utils/hash-password';
import { AccountEntity } from '../src/module/auth/infarstructure/accountEntity';
import {
  CategoryEntity,
  ProductEntity,
  ProductTypeEntity,
  VariantDetailEntity,
  VariantEntity,
  VariantGroupEntity,
  VariantValueEntity,
} from '../src/module/product/infarstructure/productEntity';

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const accountRepo = AppDataSource.getRepository(AccountEntity);
    const categoryRepo = AppDataSource.getRepository(CategoryEntity);
    const productTypeRepo = AppDataSource.getRepository(ProductTypeEntity);
    const productRepo = AppDataSource.getRepository(ProductEntity);
    const variantRepo = AppDataSource.getRepository(VariantEntity);
    const variantGroupRepo = AppDataSource.getRepository(VariantGroupEntity);
    const variantValueRepo = AppDataSource.getRepository(VariantValueEntity);
    const variantDetailRepo = AppDataSource.getRepository(VariantDetailEntity);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Avoid TRUNCATE/clear here because other modules may hold FK references
      // to catalog tables (order_items, cart_item_details, reviews...).
      const seedProductNames = ['iPhone 16 Pro', 'MacBook Air M4', 'Hidden Test Product'];
      const existingSeedProducts = await queryRunner.manager
        .getRepository(ProductEntity)
        .createQueryBuilder('p')
        .where('p.name IN (:...names)', { names: seedProductNames })
        .getMany();

      const existingProductIds = existingSeedProducts.map((product) => product.id);
      if (existingProductIds.length > 0) {
        await queryRunner.query(
          `
          DELETE FROM variant_details
          WHERE variant_id IN (
            SELECT id FROM variants WHERE product_id = ANY($1)
          )
          `,
          [existingProductIds]
        );

        await queryRunner.query(
          `
          DELETE FROM variant_values
          WHERE variant_group_id IN (
            SELECT id FROM variant_groups WHERE product_id = ANY($1)
          )
          `,
          [existingProductIds]
        );

        await queryRunner.query(`DELETE FROM variant_groups WHERE product_id = ANY($1)`, [
          existingProductIds,
        ]);

        await queryRunner.query(`DELETE FROM variants WHERE product_id = ANY($1)`, [
          existingProductIds,
        ]);

        await queryRunner.query(`DELETE FROM products WHERE id = ANY($1)`, [existingProductIds]);
      }

      await queryRunner.commitTransaction();
    } catch (cleanupError) {
      await queryRunner.rollbackTransaction();
      throw cleanupError;
    } finally {
      await queryRunner.release();
    }

    const seededPhones = ['0912345678', '0912345679'];
    await accountRepo.delete(seededPhones.map((phoneNum) => ({ phoneNum })));

    const customerPassword = await hashPassword('Password123');
    await accountRepo.save([
      accountRepo.create({ phoneNum: '0912345678', password: customerPassword, isLocked: false }),
      accountRepo.create({ phoneNum: '0912345679', password: customerPassword, isLocked: false }),
    ]);

    const smartphoneCategory =
      (await categoryRepo.findOne({ where: { name: 'Smartphone' } })) ??
      (await categoryRepo.save(categoryRepo.create({ name: 'Smartphone' })));
    const laptopCategory =
      (await categoryRepo.findOne({ where: { name: 'Laptop' } })) ??
      (await categoryRepo.save(categoryRepo.create({ name: 'Laptop' })));

    const consumerElectronicsType =
      (await productTypeRepo.findOne({ where: { name: 'Consumer Electronics' } })) ??
      (await productTypeRepo.save(productTypeRepo.create({ name: 'Consumer Electronics' })));
    const accessoriesType =
      (await productTypeRepo.findOne({ where: { name: 'Accessories' } })) ??
      (await productTypeRepo.save(productTypeRepo.create({ name: 'Accessories' })));

    const iphone = await productRepo.save(
      productRepo.create({
        name: 'iPhone 16 Pro',
        description: 'Seed product for API testing',
        totalSold: 12,
        hasVariant: true,
        isHidden: false,
        categoryId: smartphoneCategory.id,
        productTypeId: consumerElectronicsType.id,
      })
    );

    const macbook = await productRepo.save(
      productRepo.create({
        name: 'MacBook Air M4',
        description: 'Second visible product for listing',
        totalSold: 3,
        hasVariant: true,
        isHidden: false,
        categoryId: laptopCategory.id,
        productTypeId: consumerElectronicsType.id,
      })
    );

    await productRepo.save(
      productRepo.create({
        name: 'Hidden Test Product',
        description: 'Used to verify admin isHidden filter',
        totalSold: 0,
        hasVariant: false,
        isHidden: true,
        categoryId: smartphoneCategory.id,
        productTypeId: accessoriesType.id,
      })
    );

    const colorGroup = await variantGroupRepo.save(
      variantGroupRepo.create({
        productId: iphone.id,
        name: 'Color',
        displayOrder: 1,
      })
    );

    const storageGroup = await variantGroupRepo.save(
      variantGroupRepo.create({
        productId: iphone.id,
        name: 'Storage',
        displayOrder: 2,
      })
    );

    const [colorNatural, colorBlack] = await variantValueRepo.save([
      variantValueRepo.create({
        variantGroupId: colorGroup.id,
        value: 'Titanium Natural',
        imageUrl: null,
      }),
      variantValueRepo.create({
        variantGroupId: colorGroup.id,
        value: 'Titanium Black',
        imageUrl: null,
      }),
    ]);

    const [storage128, storage256] = await variantValueRepo.save([
      variantValueRepo.create({
        variantGroupId: storageGroup.id,
        value: '128GB',
        imageUrl: null,
      }),
      variantValueRepo.create({
        variantGroupId: storageGroup.id,
        value: '256GB',
        imageUrl: null,
      }),
    ]);

    const [iphoneVariant1, iphoneVariant2] = await variantRepo.save([
      variantRepo.create({
        productId: iphone.id,
        price: 90000,
        stockQuantity: 15,
        isDefault: true,
        imageUrl: null,
      }),
      variantRepo.create({
        productId: iphone.id,
        price: 32990000,
        stockQuantity: 9,
        isDefault: false,
        imageUrl: null,
      }),
    ]);

    await variantDetailRepo.save([
      variantDetailRepo.create({
        variantId: iphoneVariant1.id,
        variantValueId: colorNatural.id,
      }),
      variantDetailRepo.create({
        variantId: iphoneVariant1.id,
        variantValueId: storage128.id,
      }),
      variantDetailRepo.create({
        variantId: iphoneVariant2.id,
        variantValueId: colorBlack.id,
      }),
      variantDetailRepo.create({
        variantId: iphoneVariant2.id,
        variantValueId: storage256.id,
      }),
    ]);

    await variantRepo.save(
      variantRepo.create({
        productId: macbook.id,
        price: 26990000,
        stockQuantity: 7,
        isDefault: true,
        imageUrl: null,
      })
    );

    console.log('Seed completed successfully.');
    console.log('Test account: 0912345678 / Password123');
  } finally {
    await AppDataSource.destroy();
  }
}

void seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
