import { NotFoundOrderError } from '../../domain/errors';
import { IOrderRepository } from '../../domain/interface';
import { PAYMENT_STATUS_VALUE } from '../../domain/value_objects';
import { UpdateOrderPaymentDTO, OrderDetailDTO } from '../dtos';
import { appLogger } from '@/shared/logging/appLogger';

/**
 * Handle payment success callback from payment module
 * Automatically update order to CONFIRMED status when payment is successful
 */
export class HandleOrderPaymentSuccessUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: number, paymentMethod: string): Promise<OrderDetailDTO> {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new NotFoundOrderError();
    }

    // Update payment status to SUCCESS
    const updated = await this.orderRepository.updateOrderPayment(orderId, {
      isPaid: true,
      paymentStatus: PAYMENT_STATUS_VALUE.SUCCESS,
      paymentMethod: paymentMethod as any,
    });

    if (!updated) {
      throw new NotFoundOrderError();
    }

    // Also update order status from PENDING to CONFIRMED
    const result = await this.orderRepository.updateOrderStatus(orderId, {
      status: 'confirmed',
      note: 'Auto-confirmed after successful payment',
    });

    if (!result) {
      throw new NotFoundOrderError();
    }

    appLogger.info('Order payment success handled', {
      orderId,
      newStatus: 'confirmed',
      paymentStatus: PAYMENT_STATUS_VALUE.SUCCESS,
    });

    return result;
  }
}
