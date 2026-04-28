import { Router } from "express";
import { CartController } from "./controller";
import { addCartItemSchema, removeItemParamSchema, updateQuantityParamSchema, updateQuantitySchema, validateRequest } from "./validate";
import authenticate from "@/shared/middleware/authenticate";

export function createCartRouter(controller: CartController): Router {
  const cartRouter = Router();
  cartRouter.post('/carts/items', authenticate, validateRequest({ body: addCartItemSchema }), controller.addCartItem.bind(controller));
  cartRouter.get('/carts/me', authenticate, controller.getCurrentCart.bind(controller));
  cartRouter.delete('/carts/items/:variantId', authenticate, validateRequest({ params: removeItemParamSchema }), controller.removeItem.bind(controller));
  cartRouter.patch('/carts/items/:variantId', authenticate, validateRequest({params: updateQuantityParamSchema, body: updateQuantitySchema }), controller.updateQuantity.bind(controller));
  return cartRouter;
}