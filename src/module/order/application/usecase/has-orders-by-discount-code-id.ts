import { IOrderRepository } from '../../domain/interface';

export class HasOrdersByDiscountCodeIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  execute(discountCodeId: number): Promise<boolean> {
    return this.orderRepository.hasOrdersByDiscountCodeId(discountCodeId);
  }
}
