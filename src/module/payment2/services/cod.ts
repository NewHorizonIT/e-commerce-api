import { TypeORMOrderRepository } from '@/module/order/infrastructure/repository';
import { BadRequestError } from '@/shared/error/error';
import { UpdateOrderPaymentDTO } from '@/module/order/application/dtos';
import { PAYMENT_METHOD_VALUE } from '@/module/order/domain/value_objects';
import { InitiatePaymentDTO } from '../dtos/initiate-payment';

export default class CodService {
  private orderRepo: TypeORMOrderRepository;

  constructor() {
    this.orderRepo = new TypeORMOrderRepository();
  }

  codPayment = async (initiatePayment: InitiatePaymentDTO) => {
    const order = await this.orderRepo.findOrderById(initiatePayment.getOrderId());
    if (!order) {
      throw new BadRequestError('Order not found');
    }
    if (order.isPaid) {
      throw new BadRequestError('Order already paid');
    }

    const orderUpdated = await this.orderRepo.updateOrderPayment(initiatePayment.getOrderId(), {
      isPaid: true,
      paymentMethod: PAYMENT_METHOD_VALUE.CASH_ON_DELIVERY,
    } as UpdateOrderPaymentDTO);

    return {
      status: 200,
      message: 'Thanh toán COD thành công',
      data: { orderUpdated },
    };
  };
}
