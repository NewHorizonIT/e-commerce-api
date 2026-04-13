import { CartDTO, CreateCartItemDetailDTO } from "./dtos";

export interface ICartModulePort {
  addCartItem(cartId: number,dto: CreateCartItemDetailDTO): Promise<CartDTO>;
  getCurrentCart(id: number): Promise<CartDTO>;
}