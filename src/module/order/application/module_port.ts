import {
  CreateOrderDTO,
  OrderDetailDTO,
  OrderListQueryDTO,
  PaginatedOrdersDTO,
  UpdateOrderPaymentDTO,
  UpdateOrderStatusDTO,
} from './dtos';

export interface IOrderModulePort {
  listOrders(query: OrderListQueryDTO): Promise<PaginatedOrdersDTO>;
  findOrderById(orderId: number): Promise<OrderDetailDTO>;

  createOrder(dto: CreateOrderDTO): Promise<OrderDetailDTO>;
  updateOrderPayment(orderId: number, dto: UpdateOrderPaymentDTO): Promise<OrderDetailDTO>;
  updateOrderStatus(orderId: number, dto: UpdateOrderStatusDTO): Promise<OrderDetailDTO>;

  hasOrdersByAccountId(accountId: number): Promise<boolean>;
  hasOrdersByShippingInfoId(shippingInfoId: number): Promise<boolean>;
  hasOrdersByDiscountCodeId(discountCodeId: number): Promise<boolean>;
}
