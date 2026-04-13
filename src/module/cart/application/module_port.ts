import { CartDTO, CreateCartItemDetailDTO } from "./dtos";

export interface ICartModulePort {
  addCartItem(dto: CreateCartItemDetailDTO): Promise<CartDTO>;
  getCurrentCart(id: number): Promise<CartDTO>;
}