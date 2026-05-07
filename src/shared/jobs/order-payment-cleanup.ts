import { appLogger } from '@/shared/logging/appLogger';
import { TypeORMOrderRepository } from '@/module/order/infrastructure/repository';
import { AutoCancelFailedPaymentOrdersUseCase } from '@/module/order/application/usecase/auto-cancel-failed-payment-orders';

export function startOrderPaymentCleanupJob(): void {
  const orderRepository = new TypeORMOrderRepository();
  const cleanupUseCase = new AutoCancelFailedPaymentOrdersUseCase(orderRepository, 30);
  const intervalMs = Number(process.env.ORDER_PAYMENT_CLEANUP_INTERVAL_MS ?? 5 * 60 * 1000);

  const runCleanup = async () => {
    try {
      const result = await cleanupUseCase.execute();
      appLogger.info('Order payment cleanup job finished', {
        cancelledCount: result.cancelledCount,
      });
    } catch (error) {
      appLogger.error('Order payment cleanup job failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  void runCleanup();
  setInterval(() => {
    void runCleanup();
  }, intervalMs);

  appLogger.info('Order payment cleanup job scheduled', { intervalMs });
}
