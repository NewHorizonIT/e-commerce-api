import { IOrderRepository } from "../../domain/interface";

export class HasOrdersByShippingInfoIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  execute(shippingInfoId: number): Promise<boolean> {
    return this.orderRepository.hasOrdersByShippingInfoId(shippingInfoId);
  }
}