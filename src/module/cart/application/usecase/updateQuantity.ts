import { inject, injectable } from "tsyringe";
import { CART_TOKENS } from "../../tokens";
import { ICartRepository } from "../../domain/interface";
import { CartDTO, CartItemDetailDTO } from "../dtos";
import { NotFoundCartErrorById, NotFoundCartItemErrorByVariantId } from "./errors";
import { Quantity } from "../../domain/value_objects";

@injectable()
export default class UpdateQuantityUseCase {
  constructor(
    @inject(CART_TOKENS.ICartRepository)
    private readonly cartRepository: ICartRepository
  ) { }

  async execute(cartId: number, variantId: number, quantity: number): Promise<CartDTO> {
    const cart = await this.cartRepository.findById(cartId);

    if (!cart) {
      throw new NotFoundCartErrorById(cartId);
    }

    // có giữ tham chiếu tới item tương ứng
    const itemOfVariant = cart.findItemByVariantId(variantId);
    if(!itemOfVariant){
        throw new NotFoundCartItemErrorByVariantId(variantId);
    }

    itemOfVariant.updateQuantity(new Quantity(quantity));

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