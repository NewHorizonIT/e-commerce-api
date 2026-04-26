import { AppDataSource } from "../src/config/database";
import { CartEntity } from '../src/module/cart/infrastructure/cartEntity';

async function seedCart(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const cartRepo = AppDataSource.getRepository(CartEntity);
    await cartRepo.delete({ accountId: 1 });

    await cartRepo.save(
      cartRepo.create({
        accountId: 1,
      })
    );

    console.log('--- Seed giỏ hàng hoàn tất thành công! ---');
  } catch (error) {
    console.error('Lỗi khi seed giỏ hàng:', error);
  } finally {
    await AppDataSource.destroy();
  }
}
seedCart().catch((err) => console.error(err));