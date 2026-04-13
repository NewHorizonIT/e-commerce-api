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

  async execute(dto: CartItemDetailDTO): Promise<CartDTO> {
    const cart = await this.cartRepository.findById(dto.cartId);

    if (!cart) {
      throw new NotFoundCartErrorById(dto.cartId);
    }

    const item = CartItemDetail.create({
      quantity: new Quantity(dto.quantity),
      cartId: dto.cartId,
      variantId: dto.variantId
    });
    cart.addItem(item);

    const savedCart = await this.cartRepository.save(cart);
    const cartId = savedCart.getRequiredId();

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
      id: cartId,
      accountId: savedCart.getAccountId(),
      items: itemsDTO
    };
    return response;
  }
}