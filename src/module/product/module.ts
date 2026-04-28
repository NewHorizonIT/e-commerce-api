import { IProductModulePort } from './application/module_port';
import ProductUseCases from './application/usecase/productUseCases';
import { TypeORMProductRepository } from './infarstructure/repository';
import { ProductModuleAdapter } from './module_adapter';
import { ProductController } from './presentation/controller';
import { createProductRouter } from './presentation/router';

export class ProductModule {
  public readonly router;
  public readonly publicApi: IProductModulePort;

  constructor() {
    const productRepository = new TypeORMProductRepository();
    const productUseCases = new ProductUseCases(productRepository);

    this.publicApi = new ProductModuleAdapter(productUseCases);

    const controller = new ProductController(this.publicApi);
    this.router = createProductRouter(controller);
  }
}

export const productModule = new ProductModule();
export const productPublicApi = productModule.publicApi;
