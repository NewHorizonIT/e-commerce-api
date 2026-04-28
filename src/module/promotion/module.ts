import { container } from "tsyringe";
import { IPromotionModulePort } from "./application/module_port";
import { PROMOTION_TOKENS } from "./tokens";
import { PromotionController } from "./presentation/controller";
import { createPromotionRouter } from "./presentation/router";

export class PromotionModule {
  public readonly router;
  public readonly publicApi: IPromotionModulePort;

  constructor() {
    this.publicApi = container.resolve<IPromotionModulePort>(PROMOTION_TOKENS.IPromotionModulePort);
    const controller = container.resolve(PromotionController);
    this.router = createPromotionRouter(controller);
  }
}

export const promotionModule = new PromotionModule();
export const promotionPublicApi = promotionModule.publicApi;