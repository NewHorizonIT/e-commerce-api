import { IOrderModulePort } from './application/module_port';
import { TypeORMOrderRepository } from './infrastructure/repository';
import { OrderModuleAdapter } from './module_adapter';
import { OrderController } from './presentation/controller';
import { createOrderRouter } from './presentation/router';
import { ListOrdersUseCase } from './application/usecase/list-orders';
import { FindOrderByIdUseCase } from './application/usecase/find-order-by-id';
import { CreateOrderUseCase } from './application/usecase/create-order';
import { UpdateOrderPaymentUseCase } from './application/usecase/update-order-payment';
import { UpdateOrderStatusUseCase } from './application/usecase/update-order-status';
import { HasOrdersByAccountIdUseCase } from './application/usecase/has-orders-by-account-id';
import { HasOrdersByShippingInfoIdUseCase } from './application/usecase/has-orders-by-shipping-info-id';
import { HasOrdersByDiscountCodeIdUseCase } from './application/usecase/has-orders-by-discount-code-id';

export class OrderModule {
  public readonly router;
  public readonly publicApi: IOrderModulePort;

  constructor() {
    const orderRepository = new TypeORMOrderRepository();

    const useCases = {
      listOrders: new ListOrdersUseCase(orderRepository),
      findOrderById: new FindOrderByIdUseCase(orderRepository),
      createOrder: new CreateOrderUseCase(orderRepository),
      updateOrderPayment: new UpdateOrderPaymentUseCase(orderRepository),
      updateOrderStatus: new UpdateOrderStatusUseCase(orderRepository),
      hasOrdersByAccountId: new HasOrdersByAccountIdUseCase(orderRepository),
      hasOrdersByShippingInfoId: new HasOrdersByShippingInfoIdUseCase(orderRepository),
      hasOrdersByDiscountCodeId: new HasOrdersByDiscountCodeIdUseCase(orderRepository),
    };
    this.publicApi = new OrderModuleAdapter(useCases);

    const controller = new OrderController(this.publicApi);
    this.router = createOrderRouter(controller);
  }
}

export const orderModule = new OrderModule();
export const orderPublicApi = orderModule.publicApi;
