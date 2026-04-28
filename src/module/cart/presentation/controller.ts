import { inject, injectable } from "tsyringe";
import { CART_TOKENS } from "../tokens";
import { ICartModulePort } from "../application/module_port";
import { Request, Response } from "express";
import { appLogger } from "@/shared/logging/appLogger";
import SuccessResponse from "@/shared/response/writeResponse";
import { StatusCode } from "@/shared/response/statusCode";

@injectable()
export class CartController {
    constructor(@inject(CART_TOKENS.ICartModulePort) private readonly cartModulePort: ICartModulePort) { }

    async addCartItem(req: Request, res: Response): Promise<void> {
        const cart = await this.cartModulePort.addCartItem(req.userId!, req.body);
        appLogger.info('Item added to cart', { cart: cart.id });
        new SuccessResponse(cart, 'Item added successfully', StatusCode.CREATED).send(res);
    }

    async getCurrentCart(req: Request, res: Response): Promise<void> {
        const cart = await this.cartModulePort.getCurrentCart(req.userId!);
        new SuccessResponse(cart, undefined, StatusCode.OK).send(res);
    }

    async removeItem(req: Request, res: Response): Promise<void> {
        const { variantId } = req.params as { variantId: string };
        const cart = await this.cartModulePort.removeItem(req.userId!, Number(variantId));
        new SuccessResponse(cart, undefined, StatusCode.OK).send(res);
    }

    async updateQuantity(req: Request, res: Response): Promise<void>{
        const { variantId } = req.params as { variantId: string };
        const { quantity } = req.body as { quantity: number };
        const cart = await this.cartModulePort.updateQuantity(req.userId!, Number(variantId), quantity);
        new SuccessResponse(cart, undefined, StatusCode.OK).send(res);
    }
}