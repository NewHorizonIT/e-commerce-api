export class InitiatePaymentDTO {
  private orderId: number;

  constructor({ orderId }: { orderId: number }) {
    this.orderId = orderId;
  }

  getOrderId(): number {
    return this.orderId;
  }
}
