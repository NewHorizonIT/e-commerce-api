import {
  CreateOrderDTO,
  OrderDetailDTO,
  OrderListQueryDTO,
  PaginatedOrdersDTO,
  UpdateOrderPaymentDTO,
  UpdateOrderStatusDTO,
} from './application/dtos';
import { IOrderModulePort } from './application/module_port';
import { ListOrdersUseCase } from './application/usecase/list-orders';
import { FindOrderByIdUseCase } from './application/usecase/find-order-by-id';
import { CreateOrderUseCase } from './application/usecase/create-order';
import { UpdateOrderPaymentUseCase } from './application/usecase/update-order-payment';
import { UpdateOrderStatusUseCase } from './application/usecase/update-order-status';
import { HasOrdersByAccountIdUseCase } from './application/usecase/has-orders-by-account-id';
import { HasOrdersByShippingInfoIdUseCase } from './application/usecase/has-orders-by-shipping-info-id';
import { HasOrdersByDiscountCodeIdUseCase } from './application/usecase/has-orders-by-discount-code-id';

type OrderUseCases = {
  listOrders: ListOrdersUseCase;
  findOrderById: FindOrderByIdUseCase;
  createOrder: CreateOrderUseCase;
  updateOrderPayment: UpdateOrderPaymentUseCase;
  updateOrderStatus: UpdateOrderStatusUseCase;
  hasOrdersByAccountId: HasOrdersByAccountIdUseCase;
  hasOrdersByShippingInfoId: HasOrdersByShippingInfoIdUseCase;
  hasOrdersByDiscountCodeId: HasOrdersByDiscountCodeIdUseCase;
};

export class OrderModuleAdapter implements IOrderModulePort {
  constructor(private readonly useCases: OrderUseCases) {}

  listOrders(query: OrderListQueryDTO): Promise<PaginatedOrdersDTO> {
    return this.useCases.listOrders.execute(query);
  }

  findOrderById(orderId: number): Promise<OrderDetailDTO> {
    return this.useCases.findOrderById.execute(orderId);
  }

  createOrder(dto: CreateOrderDTO): Promise<OrderDetailDTO> {
    return this.useCases.createOrder.execute(dto);
  }

  updateOrderPayment(orderId: number, dto: UpdateOrderPaymentDTO): Promise<OrderDetailDTO> {
    return this.useCases.updateOrderPayment.execute(orderId, dto);
  }

  updateOrderStatus(orderId: number, dto: UpdateOrderStatusDTO): Promise<OrderDetailDTO> {
    return this.useCases.updateOrderStatus.execute(orderId, dto);
  }

  hasOrdersByAccountId(accountId: number): Promise<boolean> {
    return this.useCases.hasOrdersByAccountId.execute(accountId);
  }

  hasOrdersByShippingInfoId(shippingInfoId: number): Promise<boolean> {
    return this.useCases.hasOrdersByShippingInfoId.execute(shippingInfoId);
  }

  hasOrdersByDiscountCodeId(discountCodeId: number): Promise<boolean> {
    return this.useCases.hasOrdersByDiscountCodeId.execute(discountCodeId);
  }
}
