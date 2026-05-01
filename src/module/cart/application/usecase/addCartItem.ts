import { inject, injectable } from 'tsyringe';
import { CART_TOKENS } from '../../tokens';
import { ICartRepository } from '../../domain/interface';
import { CartDTO, CartItemDetailDTO } from '../dtos';
import { Cart, CartItemDetail } from '../../domain/domain';
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
    let cart = await this.cartRepository.findByAccountId(accountId);

    if (!cart) {
      cart = Cart.create({ accountId });
      cart = await this.cartRepository.save(cart);
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
