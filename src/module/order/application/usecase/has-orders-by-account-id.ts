import { IOrderRepository } from '../../domain/interface';

export class HasOrdersByAccountIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  execute(accountId: number): Promise<boolean> {
    return this.orderRepository.hasOrdersByAccountId(accountId);
  }
}
