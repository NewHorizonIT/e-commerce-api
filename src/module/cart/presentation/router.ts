import { Router } from "express";
import { CartController } from "./controller";
import { addCartItemParamSchema, addCartItemSchema, removeItemParamSchema, updateQuantityParamSchema, updateQuantitySchema, validateRequest } from "./validate";
import authenticate from "@/shared/middleware/authenticate";

export function createCartRouter(controller: CartController): Router {
  const cartRouter = Router();
  cartRouter.post('/carts/:cartId', validateRequest({ params: addCartItemParamSchema, body: addCartItemSchema }), controller.addCartItem.bind(controller));
  cartRouter.get('/carts/me', authenticate, controller.getCurrentCart.bind(controller));
  cartRouter.delete('/carts/:cartId/variants/:variantId', validateRequest({ params: removeItemParamSchema }), controller.removeItem.bind(controller));
  cartRouter.patch('/carts/:cartId/variants/:variantId', validateRequest({ params: updateQuantityParamSchema, body: updateQuantitySchema }), controller.updateQuantity.bind(controller));
  return cartRouter;
}