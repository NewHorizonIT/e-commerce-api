import { CartDTO, CartItemDetailDTO } from "./dtos";

export interface ICartModulePort {
  addCartItem(accountId: number,dto: CartItemDetailDTO): Promise<CartDTO>;
  getCurrentCart(id: number): Promise<CartDTO>;
  removeItem(cartId: number, variantId: number): Promise<CartDTO>;
  updateQuantity(cartId: number, variantId: number, quantity: number): Promise<CartDTO>;
}