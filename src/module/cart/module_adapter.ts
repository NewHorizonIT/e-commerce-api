import { inject, injectable } from "tsyringe";
import { ICartModulePort } from "./application/module_port";
import { CartItemDetailDTO, CartDTO } from "./application/dtos";
import AddCartItemUseCase from "./application/usecase/addCartItem";
import GetCurrentCartUseCase from "./application/usecase/getCurrentCart";
import RemoveItemUseCase from "./application/usecase/removeItem";
import { Quantity } from './domain/value_objects';
import UpdateQuantityUseCase from "./application/usecase/updateQuantity";

@injectable()
export class CartModuleAdapter implements ICartModulePort {
    constructor(
        @inject(AddCartItemUseCase)
        private readonly addCartItemUseCase: AddCartItemUseCase,
        @inject(GetCurrentCartUseCase)
        private readonly getCurrentCartUseCase: GetCurrentCartUseCase,
        @inject(RemoveItemUseCase)
        private readonly removeItemUseCase: RemoveItemUseCase,
        @inject(UpdateQuantityUseCase)
        private readonly updateQuantityUseCase: UpdateQuantityUseCase,
    ) { }
    addCartItem(cartId: number, dto: CartItemDetailDTO): Promise<CartDTO> {
        return this.addCartItemUseCase.execute(cartId, dto);
    }

    getCurrentCart(id: number): Promise<CartDTO> {
        return this.getCurrentCartUseCase.execute(id);
    }

    removeItem(cartId: number, variantId: number) {
        return this.removeItemUseCase.execute(cartId, variantId);
    }

    updateQuantity(cartId: number, variantId: number, quantity: number) {
        return this.updateQuantityUseCase.execute(cartId, variantId, quantity);
    }
}