import { NotFoundOrderError } from "../../domain/errors";
import { IOrderRepository } from "../../domain/interface";
import { UpdateOrderStatusDTO, OrderDetailDTO } from "../dtos";

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: number, dto: UpdateOrderStatusDTO): Promise<OrderDetailDTO> {
    const order = await this.orderRepository.updateOrderStatus(orderId, dto);
    if (!order) {
      throw new NotFoundOrderError();
    }

    return order;
  }
}
