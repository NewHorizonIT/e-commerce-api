import { inject, injectable } from 'tsyringe';
import { CART_TOKENS } from '../../tokens';
import { ICartRepository } from '../../domain/interface';
import { CartDTO, CartItemDetailDTO } from '../dtos';
import { NotFoundCartItemErrorByAccountId, NotFoundCartItemErrorByVariantId } from './errors';
import { Quantity } from '../../domain/value_objects';
import GetCurrentCartUseCase from './getCurrentCart';

@injectable()
export default class UpdateQuantityUseCase {
  constructor(
    @inject(CART_TOKENS.ICartRepository)
    private readonly cartRepository: ICartRepository,
    @inject(GetCurrentCartUseCase)
    private readonly getCurrentCartUseCase: GetCurrentCartUseCase
  ) {}

  async execute(accountId: number, variantId: number, quantity: number): Promise<CartDTO> {
    const cart = await this.cartRepository.findByAccountId(accountId);

    if (!cart) {
      throw new NotFoundCartItemErrorByAccountId(accountId);
    }

    // có giữ tham chiếu tới item tương ứng
    const itemOfVariant = cart.findItemByVariantId(variantId);
    if (!itemOfVariant) {
      throw new NotFoundCartItemErrorByVariantId(variantId);
    }

    itemOfVariant.updateQuantity(new Quantity(quantity));

    await this.cartRepository.save(cart);
    return await this.getCurrentCartUseCase.execute(accountId);
  }
}
