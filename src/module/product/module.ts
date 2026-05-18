import 'reflect-metadata';
import { container } from 'tsyringe';
import { IProductModulePort } from './application/module_port';
import { registerProductDependencies } from './container';
import { ProductController } from './presentation/controller';
import { createProductRouter } from './presentation/router';
import { PRODUCT_TOKENS } from './tokens';

export class ProductModule {
  public readonly router;
  public readonly publicApi: IProductModulePort;

  constructor() {
    registerProductDependencies(container);
    this.publicApi = container.resolve<IProductModulePort>(PRODUCT_TOKENS.IProductModulePort);
    const controller = container.resolve(ProductController);
    this.router = createProductRouter(controller);
  }
}

export const productModule = new ProductModule();
export const productPublicApi = productModule.publicApi;
