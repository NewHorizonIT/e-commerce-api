import { DependencyContainer } from "tsyringe";
import { PROMOTION_TOKENS } from "./tokens";
import { TypeORMPromotionRepository } from "./infrastructure/repository";
import { PromotionModuleAdapter } from "./module_adapter";

export function registerPromotionDependencies(container: DependencyContainer): void {
    container.registerSingleton(PROMOTION_TOKENS.IPromotionRepository, TypeORMPromotionRepository);
    container.registerSingleton(PROMOTION_TOKENS.IPromotionModulePort, PromotionModuleAdapter);

}