import { inject, injectable } from 'tsyringe';
import { CART_TOKENS } from '../../tokens';
import { ICartRepository } from '../../domain/interface';
import { CartDTO, CartItemDetailDTO } from '../dtos';
import { NotFoundCartItemErrorByAccountId, NotFoundCartItemErrorByVariantId } from './errors';
import GetCurrentCartUseCase from './getCurrentCart';

@injectable()
export default class RemoveItemUseCase {
  constructor(
    @inject(CART_TOKENS.ICartRepository)
    private readonly cartRepository: ICartRepository,
    @inject(GetCurrentCartUseCase)
    private readonly getCurrentCartUseCase: GetCurrentCartUseCase
  ) {}

  async execute(accountId: number, variantId: number): Promise<CartDTO> {
    const cart = await this.cartRepository.findByAccountId(accountId);

    if (!cart) {
      throw new NotFoundCartItemErrorByAccountId(accountId);
    }

    if (!cart.hasVariant(variantId)) {
      throw new NotFoundCartItemErrorByVariantId(variantId);
    }

    cart.removeItem(variantId);

    await this.cartRepository.save(cart);
    return await this.getCurrentCartUseCase.execute(accountId);
  }
}
