import { container } from "tsyringe";
import { ICartModulePort } from "./application/module_port";
import { CART_TOKENS } from "./tokens";
import { CartController } from "./presentation/controller";
import { createCartRouter } from "./presentation/router";

export class CartModule {
  public readonly router;
  public readonly publicApi: ICartModulePort;

  constructor() {
    this.publicApi = container.resolve<ICartModulePort>(CART_TOKENS.ICartModulePort);
    const controller = container.resolve(CartController);
    this.router = createCartRouter(controller);
  }
}

export const cartModule = new CartModule();
export const cartPublicApi = cartModule.publicApi;