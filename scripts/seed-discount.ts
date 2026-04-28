import { AppDataSource } from '../src/config/database';
import { DiscountCodeEntity } from '../src/module/discount/infrastructure/discount-entity';
import { DISCOUNT_TYPE_VALUE } from '../src/module/discount/domain/value_objects';

async function seedDiscount(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const discountRepo = AppDataSource.getRepository(DiscountCodeEntity);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /***
       * XÓA DỮ LIỆU MÃ GIẢM GIÁ CŨ (tuỳ chọn)
       */
      await queryRunner.query(`DELETE FROM discount_codes`);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    /***
     * TẠO MÃ GIẢM GIÁ
     */
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const discounts = [
      // Giảm giá phần trăm - Khuyến mãi mùa hè
      {
        name: 'Khuyến mãi mùa hè 2026',
        discountCode: 'SUMMER20',
        type: DISCOUNT_TYPE_VALUE.PERCENTAGE,
        discountValue: 20,
        minimumOrderValue: 50000,
        maximumDiscount: 500000,
        maximumUsage: 1000,
        startTime: new Date(2026, 5, 1), // 1 tháng 6
        endTime: new Date(2026, 7, 31, 23, 59, 59), // 31 tháng 8
        isActive: true,
        allowSaveBefore: true,
      },
      // Giảm giá cố định - Chào mừng khách hàng mới
      {
        name: 'Chào mừng khách hàng mới',
        discountCode: 'WELCOME100',
        type: DISCOUNT_TYPE_VALUE.FIXED,
        discountValue: 100000,
        minimumOrderValue: 200000,
        maximumDiscount: 100000,
        maximumUsage: 500,
        startTime: new Date(2026, 3, 1), // 1 tháng 4
        endTime: new Date(2026, 5, 30, 23, 59, 59), // 30 tháng 6
        isActive: true,
        allowSaveBefore: true,
      },
      // Giảm giá phần trăm - Flash sale
      {
        name: 'Flash sale - Thời gian hạn chế',
        discountCode: 'FLASH50',
        type: DISCOUNT_TYPE_VALUE.PERCENTAGE,
        discountValue: 50,
        minimumOrderValue: 500000,
        maximumDiscount: 1000000,
        maximumUsage: 100,
        startTime: new Date(2026, 3, 27, 10, 0, 0), // 27 tháng 4, 10:00 sáng
        endTime: new Date(2026, 3, 27, 23, 59, 59), // 27 tháng 4, 23:59 (cùng ngày)
        isActive: true,
        allowSaveBefore: false,
      },
      // Giảm giá cố định - Miễn phí vận chuyển
      {
        name: 'Miễn phí vận chuyển',
        discountCode: 'FREESHIP50',
        type: DISCOUNT_TYPE_VALUE.FIXED,
        discountValue: 50000,
        minimumOrderValue: 100000,
        maximumDiscount: 50000,
        maximumUsage: 2000,
        startTime: startOfMonth,
        endTime: endOfMonth,
        isActive: true,
        allowSaveBefore: true,
      },
      // Giảm giá phần trăm - Khách hàng VIP
      {
        name: 'Ưu đãi độc quyền thành viên VIP',
        discountCode: 'VIP30',
        type: DISCOUNT_TYPE_VALUE.PERCENTAGE,
        discountValue: 30,
        minimumOrderValue: 1000000,
        maximumDiscount: 2000000,
        maximumUsage: 200,
        startTime: new Date(2026, 0, 1), // 1 tháng 1
        endTime: new Date(2026, 11, 31, 23, 59, 59), // 31 tháng 12 (cả năm)
        isActive: true,
        allowSaveBefore: true,
      },
      // Mã giảm giá không hoạt động - Hết hạn
      {
        name: 'Khuyến mãi Lễ Phục Sinh 2026',
        discountCode: 'EASTER25',
        type: DISCOUNT_TYPE_VALUE.PERCENTAGE,
        discountValue: 25,
        minimumOrderValue: 0,
        maximumDiscount: 750000,
        maximumUsage: 500,
        startTime: new Date(2026, 3, 9),
        endTime: new Date(2026, 3, 16, 23, 59, 59),
        isActive: false, // Hết hạn
        allowSaveBefore: true,
      },
      // Giảm giá cố định - Tháng sinh nhật
      {
        name: 'Ưu đãi tháng sinh nhật',
        discountCode: 'BIRTHDAY200',
        type: DISCOUNT_TYPE_VALUE.FIXED,
        discountValue: 200000,
        minimumOrderValue: 500000,
        maximumDiscount: 200000,
        maximumUsage: 300,
        startTime: new Date(2026, 3, 1),
        endTime: new Date(2026, 3, 30, 23, 59, 59),
        isActive: true,
        allowSaveBefore: true,
      },
      // Giảm giá phần trăm - Gói combo
      {
        name: 'Gói combo - Mua 2 giảm 15%',
        discountCode: 'BUNDLE15',
        type: DISCOUNT_TYPE_VALUE.PERCENTAGE,
        discountValue: 15,
        minimumOrderValue: 300000,
        maximumDiscount: 600000,
        maximumUsage: 800,
        startTime: new Date(2026, 2, 1),
        endTime: new Date(2026, 8, 30, 23, 59, 59),
        isActive: true,
        allowSaveBefore: true,
      },
    ];

    const savedDiscounts = await discountRepo.save(
      discounts.map((discount) => discountRepo.create(discount))
    );

    console.log(`✅ Seed mã giảm giá hoàn tất thành công!`);
    console.log(`✅ Tổng số mã giảm giá được tạo: ${savedDiscounts.length}`);
    console.log('\n📋 Các mã giảm giá mẫu:');
    console.log('   - SUMMER20: Giảm 20% (đơn hàng tối thiểu 50K)');
    console.log('   - WELCOME100: Giảm 100K (đơn hàng tối thiểu 200K) - Khách hàng mới');
    console.log('   - FLASH50: Giảm 50% (thời gian hạn chế) - Chỉ 27/4');
    console.log('   - FREESHIP50: Miễn phí vận chuyển 50K');
    console.log('   - VIP30: Giảm 30% (đơn hàng tối thiểu 1M) - Thành viên VIP');
    console.log('   - BIRTHDAY200: Giảm 200K (đơn hàng tối thiểu 500K)');
    console.log('   - BUNDLE15: Giảm 15% (đơn hàng tối thiểu 300K) - Gói combo');
  } finally {
    await AppDataSource.destroy();
  }
}

void seedDiscount().catch((error) => {
  console.error('❌ Seed mã giảm giá thất bại:', error);
  process.exit(1);
});
