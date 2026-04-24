import { inject, injectable } from "tsyringe";
import { CART_TOKENS } from "../../tokens";
import { ICartRepository } from "../../domain/interface";
import { NotFoundCartItemErrorByAccountId } from "./errors";
import { CartDTO, CartItemDetailDTO } from "../dtos";

@injectable()
export default class GetCurrentCartUseCase {
  constructor(
    @inject(CART_TOKENS.ICartRepository)
    private readonly cartRepository: ICartRepository
  ) { }

  async execute(accountId: number): Promise<CartDTO> {
    const cart = await this.cartRepository.findByAccountId(accountId);

    if (!cart) {
      throw new NotFoundCartItemErrorByAccountId(accountId);
    }

    const cartItems: CartItemDetailDTO[] = cart.getItems().map((item) => {
        return ({
            id: item.getRequiredId(),
            quantity: item.getQuantity().getValue(),
            variantId: item.getVariantId(),
            cartId: item.getCartid()
        });
    });
    // Create response
    const response: CartDTO = {
      id: cart.getRequiredId(),
      accountId: cart.getAccountId(),
      items: cartItems
    };
    return response;
  }
}