import { type DependencyContainer } from 'tsyringe';
import { PRODUCT_TOKENS } from './tokens';
import { TypeORMProductRepository } from './infrastructure/repository';
import ProductUseCases from './application/usecase/productUseCases';
import { ProductModuleAdapter } from './module_adapter';

export function registerProductDependencies(container: DependencyContainer): void {
  container.registerSingleton(PRODUCT_TOKENS.IProductRepository, TypeORMProductRepository);
  container.registerSingleton(PRODUCT_TOKENS.ProductUseCases, ProductUseCases);
  container.registerSingleton(PRODUCT_TOKENS.IProductModulePort, ProductModuleAdapter);
}
