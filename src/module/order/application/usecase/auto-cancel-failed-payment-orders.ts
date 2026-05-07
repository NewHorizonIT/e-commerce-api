import { appLogger } from '@/shared/logging/appLogger';
import { IOrderRepository } from '../../domain/interface';
import { OrderDetailDTO } from '../dtos';

/**
 * Auto-cancel orders that have failed payment status and exceeded timeout
 * This is typically run by a scheduled job/cron
 */
export class AutoCancelFailedPaymentOrdersUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly timeoutMinutes: number = 30 // configurable timeout
  ) {}

  async execute(): Promise<{ cancelledCount: number; orders: OrderDetailDTO[] }> {
    // Get current time and calculate cutoff time
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - this.timeoutMinutes * 60 * 1000);

    appLogger.info('Auto-cancel failed payment orders started', {
      timeoutMinutes: this.timeoutMinutes,
      cutoffTime: cutoffTime.toISOString(),
    });

    // Find all PENDING orders with FAILED payment status created before cutoff time
    // Note: This requires adding a method to IOrderRepository
    const failedOrders = await this.orderRepository.findFailedPaymentOrdersBeforeTime(cutoffTime);

    const cancelledOrders: OrderDetailDTO[] = [];

    for (const order of failedOrders) {
      try {
        // Cancel the order
        const cancelled = await this.orderRepository.updateOrderStatus(order.id, {
          status: 'cancelled',
          note: `Auto-cancelled due to failed payment timeout (${this.timeoutMinutes} minutes)`,
        });

        if (cancelled) {
          cancelledOrders.push(cancelled);
          appLogger.info('Order auto-cancelled', {
            orderId: order.id,
            reason: 'payment_timeout',
          });
        }
      } catch (error) {
        appLogger.error('Failed to auto-cancel order', {
          orderId: order.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    appLogger.info('Auto-cancel failed payment orders completed', {
      totalProcessed: failedOrders.length,
      totalCancelled: cancelledOrders.length,
    });

    return {
      cancelledCount: cancelledOrders.length,
      orders: cancelledOrders,
    };
  }
}
