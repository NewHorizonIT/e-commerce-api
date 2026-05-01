import { inject, injectable } from 'tsyringe';
import { CART_TOKENS } from '../../tokens';
import { ICartRepository } from '../../domain/interface';
import { CartDTO, CartItemDetailDTO } from '../dtos';
import { NotFoundCartItemErrorByAccountId } from './errors';
import { CartItemDetail } from '../../domain/domain';
import { Quantity } from '../../domain/value_objects';
import GetCurrentCartUseCase from './getCurrentCart';

@injectable()
export default class AddCartItemUseCase {
  constructor(
    @inject(CART_TOKENS.ICartRepository)
    private readonly cartRepository: ICartRepository,
    @inject(GetCurrentCartUseCase)
    private readonly getCurrentCartUseCase: GetCurrentCartUseCase
  ) {}

  async execute(accountId: number, dto: CartItemDetailDTO): Promise<CartDTO> {
    const cart = await this.cartRepository.findByAccountId(accountId);

    if (!cart) {
      throw new NotFoundCartItemErrorByAccountId(accountId);
    }

    const item = CartItemDetail.create({
      quantity: new Quantity(dto.quantity),
      cartId: cart.getRequiredId(),
      variantId: dto.variantId,
    });
    cart.addItem(item);

    await this.cartRepository.save(cart);
    return await this.getCurrentCartUseCase.execute(accountId);
  }
}
