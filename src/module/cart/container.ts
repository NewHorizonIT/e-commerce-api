import { DependencyContainer } from "tsyringe";
import { CART_TOKENS } from "./tokens";
import { TypeORMCartRepository } from "./infrastructure/repository";
import { CartModuleAdapter } from "./module_adapter";
import { ICartModulePort } from "./application/module_port";

export function registerCartDependencies(container: DependencyContainer): void {
  container.registerSingleton(CART_TOKENS.ICartRepository, TypeORMCartRepository);
  container.registerSingleton<ICartModulePort>(
    CART_TOKENS.ICartModulePort,
    CartModuleAdapter
  );
}