import { inject, injectable } from "tsyringe";
import { ICartModulePort } from "./application/module_port";
import { CartItemDetailDTO, CartDTO } from "./application/dtos";
import AddCartItemUseCase from "./application/usecase/addCartItem";

@injectable()
export class CartModuleAdapter implements ICartModulePort {
    constructor(
        @inject(AddCartItemUseCase)
        private readonly addCartItemUseCase: AddCartItemUseCase,
    ) { }
    addCartItem(dto: CartItemDetailDTO): Promise<CartDTO> {
        return this.addCartItemUseCase.execute(dto);
    }
}