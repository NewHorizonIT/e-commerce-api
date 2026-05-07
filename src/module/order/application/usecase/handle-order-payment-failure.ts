import { NotFoundOrderError } from '../../domain/errors';
import { IOrderRepository } from '../../domain/interface';
import { PAYMENT_STATUS_VALUE } from '../../domain/value_objects';
import { UpdateOrderPaymentDTO, OrderDetailDTO } from '../dtos';
import { appLogger } from '@/shared/logging/appLogger';

/**
 * Handle payment failure - mark order payment as failed
 * Order can be cancelled later if it remains unpaid beyond timeout
 */
export class HandleOrderPaymentFailureUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: number, paymentMethod: string): Promise<OrderDetailDTO> {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new NotFoundOrderError();
    }

    // Update payment status to FAILED
    const updated = await this.orderRepository.updateOrderPayment(orderId, {
      isPaid: false,
      paymentStatus: PAYMENT_STATUS_VALUE.FAILED,
      paymentMethod: paymentMethod as any,
    });

    if (!updated) {
      throw new NotFoundOrderError();
    }

    appLogger.info('Order payment failure handled', {
      orderId,
      paymentStatus: PAYMENT_STATUS_VALUE.FAILED,
    });

    return updated;
  }
}
