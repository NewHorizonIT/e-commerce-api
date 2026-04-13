import { Router } from "express";
import { CartController } from "./controller";
import { addCartItemParamSchema, addCartItemSchema, getCurrentCartParamSchema, removeItemParamSchema, validateRequest } from "./validate";

export function createCartRouter(controller: CartController): Router {
  const cartRouter = Router();
  cartRouter.post('/carts/:cartId', validateRequest({ params: addCartItemParamSchema, body: addCartItemSchema }), controller.addCartItem.bind(controller));
  cartRouter.get('/carts/:cartId', validateRequest({ params: getCurrentCartParamSchema }), controller.getCurrentCart.bind(controller));
  cartRouter.delete('/carts/:cartId/variants/:variantId', validateRequest({ params: removeItemParamSchema }), controller.removeItem.bind(controller));
  return cartRouter;
}