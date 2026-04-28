import {
  CreateOrderDTO,
  OrderDetailDTO,
  OrderListQueryDTO,
  PaginatedOrdersDTO,
  UpdateOrderPaymentDTO,
  UpdateOrderStatusDTO,
} from '../application/dtos';

export interface IOrderRepository {
  listOrders(query: OrderListQueryDTO): Promise<PaginatedOrdersDTO>;
  findOrderById(orderId: number): Promise<OrderDetailDTO | null>;

  createOrder(dto: CreateOrderDTO): Promise<OrderDetailDTO>;
  updateOrderStatus(orderId: number, dto: UpdateOrderStatusDTO): Promise<OrderDetailDTO | null>;
  updateOrderPayment(orderId: number, dto: UpdateOrderPaymentDTO): Promise<OrderDetailDTO | null>;

  hasOrdersByAccountId(accountId: number): Promise<boolean>;
  hasOrdersByShippingInfoId(shippingInfoId: number): Promise<boolean>;
  hasOrdersByDiscountCodeId(discountCodeId: number): Promise<boolean>;
}
