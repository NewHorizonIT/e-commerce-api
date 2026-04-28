import { IOrderRepository } from '../../domain/interface';
import { CreateOrderDTO, OrderDetailDTO } from '../dtos';

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  execute(dto: CreateOrderDTO): Promise<OrderDetailDTO> {
    return this.orderRepository.createOrder(dto);
  }
}
