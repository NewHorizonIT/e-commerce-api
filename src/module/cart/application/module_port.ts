import { CartDTO, CreateCartItemDetailDTO } from "./dtos";
import RemoveItemUseCase from './usecase/removeItem';

export interface ICartModulePort {
  addCartItem(cartId: number,dto: CreateCartItemDetailDTO): Promise<CartDTO>;
  getCurrentCart(id: number): Promise<CartDTO>;
  removeItem(cartId: number, variantId: number): Promise<CartDTO>;
}