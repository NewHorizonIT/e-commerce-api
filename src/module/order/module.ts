import { IOrderModulePort } from './application/module_port';
import OrderUseCases from './application/usecase/order-usecase';
import { TypeORMOrderRepository } from './infrastructure/repository';
import { OrderModuleAdapter } from './module_adapter';
import { OrderController } from './presentation/controller';
import { createOrderRouter } from './presentation/router';

export class OrderModule {
  public readonly router;
  public readonly publicApi: IOrderModulePort;

  constructor() {
    const orderRepository = new TypeORMOrderRepository();
    const orderUseCases = new OrderUseCases(orderRepository);

    this.publicApi = new OrderModuleAdapter(orderUseCases);

    const controller = new OrderController(this.publicApi);
    this.router = createOrderRouter(controller);
  }
}

export const orderModule = new OrderModule();
export const orderPublicApi = orderModule.publicApi;
