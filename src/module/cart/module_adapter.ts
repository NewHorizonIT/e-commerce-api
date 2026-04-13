import { inject, injectable } from "tsyringe";
import { ICartModulePort } from "./application/module_port";
import { CartItemDetailDTO, CartDTO } from "./application/dtos";
import AddCartItemUseCase from "./application/usecase/addCartItem";
import GetCurrentCartUseCase from "./application/usecase/getCurrentCart";

@injectable()
export class CartModuleAdapter implements ICartModulePort {
    constructor(
        @inject(AddCartItemUseCase)
        private readonly addCartItemUseCase: AddCartItemUseCase,
        @inject(GetCurrentCartUseCase)
        private readonly getCurrentCartUseCase: GetCurrentCartUseCase,
    ) { }
    addCartItem(dto: CartItemDetailDTO): Promise<CartDTO> {
        return this.addCartItemUseCase.execute(dto);
    }

    getCurrentCart(id: number): Promise<CartDTO>{
        return this.getCurrentCartUseCase.execute(id);
    }
}