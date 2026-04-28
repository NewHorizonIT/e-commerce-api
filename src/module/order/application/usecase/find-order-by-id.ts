import { NotFoundOrderError } from '../../domain/errors';
import { IOrderRepository } from '../../domain/interface';
import { OrderDetailDTO } from '../dtos';

export class FindOrderByIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: number): Promise<OrderDetailDTO> {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new NotFoundOrderError();
    }
    return order;
  }
}
