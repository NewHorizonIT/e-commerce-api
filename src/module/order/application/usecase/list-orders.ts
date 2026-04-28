import { IOrderRepository } from '../../domain/interface';
import { OrderListQueryDTO, PaginatedOrdersDTO } from '../dtos';

export class ListOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  execute(query: OrderListQueryDTO): Promise<PaginatedOrdersDTO> {
    return this.orderRepository.listOrders(query);
  }
}
