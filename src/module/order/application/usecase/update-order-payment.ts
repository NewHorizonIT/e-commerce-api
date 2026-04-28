import { NotFoundOrderError } from '../../domain/errors';
import { IOrderRepository } from '../../domain/interface';
import { UpdateOrderPaymentDTO, OrderDetailDTO } from '../dtos';

export class UpdateOrderPaymentUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: number, dto: UpdateOrderPaymentDTO): Promise<OrderDetailDTO> {
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
}
