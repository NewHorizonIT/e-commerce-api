import { inject, injectable } from 'tsyringe';
import { CART_TOKENS } from '../../tokens';
import { ICartRepository } from '../../domain/interface';
import { NotFoundCartItemErrorByAccountId } from './errors';
import { CartDTO, CartItemDetailDTO } from '../dtos';
import { AppDataSource } from '@/config';
import {
  VariantEntity,
  ProductEntity,
  VariantDetailEntity,
} from '@/module/product/infarstructure/productEntity';

@injectable()
export default class GetCurrentCartUseCase {
  constructor(
    @inject(CART_TOKENS.ICartRepository)
    private readonly cartRepository: ICartRepository
  ) {}

  async execute(accountId: number): Promise<CartDTO> {
    const cart = await this.cartRepository.findByAccountId(accountId);

    if (!cart) {
      throw new NotFoundCartItemErrorByAccountId(accountId);
    }

    const items = cart.getItems();
    const variantIds = items.map((i) => i.getVariantId());

    const variantRepo = AppDataSource.getRepository(VariantEntity);
    const variantDetailRepo = AppDataSource.getRepository(VariantDetailEntity);
    const productRepo = AppDataSource.getRepository(ProductEntity);

    const variants =
      variantIds.length > 0
        ? await variantRepo.find({
            where: variantIds.map((id) => ({ id })),
            relations: ['product'],
          })
        : [];

    const productIds = variants.map((v) => v.productId);
    const products =
      productIds.length > 0
        ? await productRepo.find({
            where: productIds.map((id) => ({ id })),
          })
        : [];

    const variantDetails =
      variantIds.length > 0
        ? await variantDetailRepo.find({
            where: variantIds.map((id) => ({ variantId: id })),
            relations: ['value', 'value.group'],
          })
        : [];

    const productMap = new Map<number, any>();
    products.forEach((p) => {
      productMap.set(p.id, { id: p.id, name: p.name });
    });

    const detailsByVariantId = new Map<number, any[]>();
    variantDetails.forEach((d) => {
      if (!detailsByVariantId.has(d.variantId)) {
        detailsByVariantId.set(d.variantId, []);
      }
      detailsByVariantId.get(d.variantId)!.push(d);
    });

    const variantMap = new Map<number, any>();
    variants.forEach((v) => {
      const details = detailsByVariantId.get(v.id) || [];
      const variantName = details
        .sort((a, b) => a.value.group.displayOrder - b.value.group.displayOrder)
        .map((d) => d.value.value)
        .join(', ');

      variantMap.set(v.id, {
        id: v.id,
        price: Number(v.price),
        imageUrl: v.imageUrl,
        variantName,
        productId: v.productId,
      });
    });

    const cartItems: CartItemDetailDTO[] = items.map((item) => {
      const variant = variantMap.get(item.getVariantId());
      const product = variant ? productMap.get(variant.productId) : null;
      const quantity = item.getQuantity().getValue();
      const price = variant ? variant.price : 0;
      const subtotal = price * quantity;

      return {
        cartItemId: item.getRequiredId(),
        variantId: item.getVariantId(),
        productName: product?.name || 'Unknown Product',
        variantName: variant?.variantName || 'Unknown Variant',
        imageUrl: variant?.imageUrl || null,
        price,
        quantity,
        subtotal,
      };
    });

    const totalPrice = cartItems.reduce((s, it) => s + it.subtotal, 0);
    const totalQuantity = cartItems.reduce((s, it) => s + it.quantity, 0);

    const response: CartDTO = {
      cart: {
        totalPrice,
        totalQuantity,
        items: cartItems,
      },
    };
    return response;
  }
}
