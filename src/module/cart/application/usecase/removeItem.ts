import { inject, injectable } from "tsyringe";
import { CART_TOKENS } from "../../tokens";
import { ICartRepository } from "../../domain/interface";
import { CartDTO, CartItemDetailDTO } from "../dtos";
import { NotFoundCartItemErrorByAccountId, NotFoundCartItemErrorByVariantId } from "./errors";

@injectable()
export default class RemoveItemUseCase {
  constructor(
    @inject(CART_TOKENS.ICartRepository)
    private readonly cartRepository: ICartRepository
  ) { }

  async execute(accountId: number, variantId: number): Promise<CartDTO> {
    const cart = await this.cartRepository.findByAccountId(accountId);

    if (!cart) {
      throw new NotFoundCartItemErrorByAccountId(accountId);
    }

    if(!cart.hasVariant(variantId)){
        throw new NotFoundCartItemErrorByVariantId(variantId);
    }

    cart.removeItem(variantId);

    const savedCart = await this.cartRepository.save(cart);

    const itemsDTO: CartItemDetailDTO[] = savedCart.getItems().map((item): CartItemDetailDTO => {
      const itemId = item.getRequiredId();
      return ({
        id: itemId,
        quantity: item.getQuantity().getValue(),
        cartId: item.getCartid(),
        variantId: item.getVariantId()
      });
    });

    // Create response
    const response: CartDTO = {
      id: savedCart.getRequiredId(),
      accountId: savedCart.getAccountId(),
      items: itemsDTO
    };
    return response;
  }
}