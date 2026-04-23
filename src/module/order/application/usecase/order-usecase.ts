import {
  CreateOrderDTO,
  OrderDetailDTO,
  OrderListQueryDTO,
  PaginatedOrdersDTO,
  UpdateOrderPaymentDTO,
  UpdateOrderStatusDTO,
} from '../dtos';
import { IOrderRepository } from '../../domain/interface';
import { NotFoundOrderError } from '../../domain/errors';

export default class OrderUseCases {
  constructor(private readonly orderRepository: IOrderRepository) {}

  listOrders(query: OrderListQueryDTO): Promise<PaginatedOrdersDTO> {
    return this.orderRepository.listOrders(query);
  }

  async findOrderById(orderId: number): Promise<OrderDetailDTO> {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new NotFoundOrderError();
    }

    return order;
  }

  createOrder(dto: CreateOrderDTO): Promise<OrderDetailDTO> {
    return this.orderRepository.createOrder(dto);
  }

  async updateOrderPayment(orderId: number, dto: UpdateOrderPaymentDTO): Promise<OrderDetailDTO> {
    const updated = await this.orderRepository.updateOrderPayment(orderId, dto);
    if (!updated) {
      throw new NotFoundOrderError();
    }

    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new NotFoundOrderError();
    }

    return order;
  }

  async updateOrderStatus(orderId: number, dto: UpdateOrderStatusDTO): Promise<OrderDetailDTO> {
    const order = await this.orderRepository.updateOrderStatus(orderId, dto);
    if (!order) {
      throw new NotFoundOrderError();
    }

    return order;
  }

  hasOrdersByAccountId(accountId: number): Promise<boolean> {
    return this.orderRepository.hasOrdersByAccountId(accountId);
  }

  hasOrdersByShippingInfoId(shippingInfoId: number): Promise<boolean> {
    return this.orderRepository.hasOrdersByShippingInfoId(shippingInfoId);
  }

  hasOrdersByDiscountCodeId(discountCodeId: number): Promise<boolean> {
    return this.orderRepository.hasOrdersByDiscountCodeId(discountCodeId);
  }
}
