import { AppDataSource } from '../src/config/database';
import { hashPassword } from '../src/shared/utils/hash-password';
import { PersonalInformationEntity, ShippingAddressEntity } from '../src/module/user/infrastructure/userEntity';
import { AccountEntity } from '../src/module/auth/infarstructure/accountEntity';

async function seedUserData(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const accountRepo = AppDataSource.getRepository(AccountEntity);
    const personalInfoRepo = AppDataSource.getRepository(PersonalInformationEntity);
    const shippingAddressRepo = AppDataSource.getRepository(ShippingAddressEntity);

    /**
     * Find or create account
     */
    let account = await accountRepo.findOne({
      where: { phoneNum: '0286257634' },
    });

    if (!account) {
      console.log('⚠️ Account 0286257634 not found. Creating seed account...');
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
     * Delete existing personal info and addresses
     */
    await shippingAddressRepo.delete({ accountId: account.id });
    await personalInfoRepo.delete({ accountId: account.id });

    /**
     * Seed Personal Information
     */
    const personalInfo = await personalInfoRepo.save(
      personalInfoRepo.create({
        accountId: account.id,
        name: 'Nguyễn Văn A',
        avatarUrl: 'https://via.placeholder.com/150',
        gender: true, // true = male
        birth: new Date('1990-01-15'),
      })
    );

    console.log('✅ Personal information created');

    /**
     * Seed 5 Shipping Addresses
     */
    const addresses = [
      {
        isDefault: true,
        streetAddress: '123 Đường Lê Lợi',
        ward: 'Phường Bến Thành',
        province: 'Quận 1, TP.HCM',
        receiverName: 'Nguyễn Văn A',
        receiverPhone: '0286257634',
      },
      {
        isDefault: false,
        streetAddress: '456 Đường Nguyễn Hữu Cảnh',
        ward: 'Phường 22',
        province: 'Quận Bình Thạnh, TP.HCM',
        receiverName: 'Nguyễn Văn A',
        receiverPhone: '0386257635',
      },
      {
        isDefault: false,
        streetAddress: '789 Đường Cộng Hòa',
        ward: 'Phường 13',
        province: 'Quận Tân Bình, TP.HCM',
        receiverName: 'Nguyễn Thị B',
        receiverPhone: '0386257636',
      },
      {
        isDefault: false,
        streetAddress: '321 Đường Phạm Văn Đồng',
        ward: 'Phường Linh Đông',
        province: 'Quận Thủ Đức, TP.HCM',
        receiverName: 'Nguyễn Văn A',
        receiverPhone: '0386257637',
      },
      {
        isDefault: false,
        streetAddress: '654 Đường Trường Chinh',
        ward: 'Phường 14',
        province: 'Quận 10, TP.HCM',
        receiverName: 'Nguyễn Văn C',
        receiverPhone: '0386257638',
      },
    ];

    const savedAddresses = await shippingAddressRepo.save(
      addresses.map((addr) =>
        shippingAddressRepo.create({
          accountId: account.id,
          ...addr,
        })
      )
    );

    console.log(`✅ Seed ${savedAddresses.length} shipping addresses successfully!`);
    console.log('='.repeat(50));
    console.log('User Profile:');
    console.log(`  Name: ${personalInfo.name}`);
    console.log(`  Account: ${account.phoneNum}`);
    console.log(`  Shipping Addresses: ${savedAddresses.length}`);
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Lỗi khi seed user data:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

void seedUserData().catch((error) => {
  console.error('❌ Seed user failed:', error);
  process.exit(1);
});
