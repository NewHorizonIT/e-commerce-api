import { AppDataSource } from "../src/config/database";
import { CartEntity, CartItemDetailEntity } from '../src/module/cart/infrastructure/cartEntity';
import { VariantEntity } from '../src/module/product/infarstructure/productEntity';
import { AccountEntity } from '../src/module/auth/infarstructure/accountEntity';

async function seedCart(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const cartRepo = AppDataSource.getRepository(CartEntity);
    const cartItemRepo = AppDataSource.getRepository(CartItemDetailEntity);
    const variantRepo = AppDataSource.getRepository(VariantEntity);
    const accountRepo = AppDataSource.getRepository(AccountEntity);

    /**
     * Find or create account
     */
    let account = await accountRepo.findOne({
      where: { phoneNum: '0286257634' },
    });

    if (!account) {
      console.log('⚠️ Account 0286257634 not found. Creating seed account...');
      const { hashPassword } = await import('../src/shared/utils/hash-password');
      const hashedPassword = await hashPassword('Password123');
      account = await accountRepo.save(
        accountRepo.create({
          phoneNum: '0286257634',
          password: hashedPassword,
          isLocked: false,
        })
      );
    }

    /**
     * Delete existing cart data for this account
     */
    const existingCart = await cartRepo.findOne({
      where: { accountId: account.id },
      relations: ['cartItemDetails'],
    });

    if (existingCart) {
      await cartItemRepo.delete({ cartId: existingCart.id });
      await cartRepo.delete({ id: existingCart.id });
    }

    /**
     * Get available variants (should have at least 10 from seed-product)
     */
    const variants = await variantRepo.find({
      relations: ['product'],
      take: 20,
    });

    if (variants.length === 0) {
      throw new Error('❌ No variants found. Please run seed-product.ts first!');
    }

    /**
     * Create cart
     */
    const cart = await cartRepo.save(
      cartRepo.create({
        accountId: account.id,
      })
    );

    /**
     * Add 10 cart items with different quantities
     */
    const cartItems = [];
    const quantityOptions = [1, 2, 3, 1, 2, 1, 3, 2, 1, 2];

    for (let i = 0; i < Math.min(10, variants.length); i++) {
      cartItems.push(
        cartItemRepo.create({
          cartId: cart.id,
          variantId: variants[i].id,
          quantity: quantityOptions[i],
        })
      );
    }

    await cartItemRepo.save(cartItems);

    console.log(`✅ Seed giỏ hàng hoàn tất thành công! (${cartItems.length} items)`);
  } catch (error) {
    console.error('❌ Lỗi khi seed giỏ hàng:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

void seedCart().catch((err) => {
  console.error('❌ Seed cart failed:', err);
  process.exit(1);
});