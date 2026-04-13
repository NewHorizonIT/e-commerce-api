import { inject, injectable } from "tsyringe";
import { CART_TOKENS } from "../../tokens";
import { ICartRepository } from "../../domain/interface";
import { CartDTO, CartItemDetailDTO } from "../dtos";
import { NotFoundCartErrorById } from "./errors";
import { CartItemDetail } from "../../domain/domain";
import { Quantity } from "../../domain/value_objects";

@injectable()
export default class AddCartItemUseCase {
  constructor(
    @inject(CART_TOKENS.ICartRepository)
    private readonly cartRepository: ICartRepository
  ) { }

  async execute(cartId: number, dto: CartItemDetailDTO): Promise<CartDTO> {
    const cart = await this.cartRepository.findById(cartId);

    if (!cart) {
      throw new NotFoundCartErrorById(cartId);
    }

    const item = CartItemDetail.create({
      quantity: new Quantity(dto.quantity),
      cartId: cartId,
      variantId: dto.variantId
    });
    cart.addItem(item);

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