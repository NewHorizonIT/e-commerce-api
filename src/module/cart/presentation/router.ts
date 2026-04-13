import { Router } from "express";
import { CartController } from "./controller";
import { addCartItemParamSchema, addCartItemSchema, validateRequest } from "./validate";

export function createCartRouter(controller: CartController): Router {
  const cartRouter = Router();
  cartRouter.post('/carts/:cartId', validateRequest({params: addCartItemParamSchema, body: addCartItemSchema}), controller.addCartItem.bind(controller));
  return cartRouter;
}