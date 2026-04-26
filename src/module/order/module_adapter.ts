import {
  CreateOrderDTO,
  OrderDetailDTO,
  OrderListQueryDTO,
  PaginatedOrdersDTO,
  UpdateOrderPaymentDTO,
  UpdateOrderStatusDTO,
} from './application/dtos';
import { IOrderModulePort } from './application/module_port';
import OrderUseCases from './application/usecase/order-usecase';

export class OrderModuleAdapter implements IOrderModulePort {
  constructor(private readonly orderUseCase: OrderUseCases) {}

  listOrders(query: OrderListQueryDTO): Promise<PaginatedOrdersDTO> {
    return this.orderUseCase.listOrders(query);
  }

  findOrderById(orderId: number): Promise<OrderDetailDTO> {
    return this.orderUseCase.findOrderById(orderId);
  }

  createOrder(dto: CreateOrderDTO): Promise<OrderDetailDTO> {
    return this.orderUseCase.createOrder(dto);
  }

  updateOrderPayment(orderId: number, dto: UpdateOrderPaymentDTO): Promise<OrderDetailDTO> {
    return this.orderUseCase.updateOrderPayment(orderId, dto);
  }

  updateOrderStatus(orderId: number, dto: UpdateOrderStatusDTO): Promise<OrderDetailDTO> {
    return this.orderUseCase.updateOrderStatus(orderId, dto);
  }

  hasOrdersByAccountId(accountId: number): Promise<boolean> {
    return this.orderUseCase.hasOrdersByAccountId(accountId);
  }

  hasOrdersByShippingInfoId(shippingInfoId: number): Promise<boolean> {
    return this.orderUseCase.hasOrdersByShippingInfoId(shippingInfoId);
  }

  hasOrdersByDiscountCodeId(discountCodeId: number): Promise<boolean> {
    return this.orderUseCase.hasOrdersByDiscountCodeId(discountCodeId);
  }
}
