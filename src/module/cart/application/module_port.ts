import { CartDTO, CartItemDetailDTO } from "./dtos";

export interface ICartModulePort {
  addCartItem(accountId: number,dto: CartItemDetailDTO): Promise<CartDTO>;
  getCurrentCart(id: number): Promise<CartDTO>;
  removeItem(accountId: number, variantId: number): Promise<CartDTO>;
  updateQuantity(accountId: number, variantId: number, quantity: number): Promise<CartDTO>;
}