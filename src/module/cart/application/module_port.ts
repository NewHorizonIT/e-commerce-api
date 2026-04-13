import { CartDTO, CreateCartItemDetailDTO } from "./dtos";

export interface ICartModulePort {
  addCartItem(dto: CreateCartItemDetailDTO): Promise<CartDTO>;
}