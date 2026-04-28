import { IPaymentModulePort } from './application/module_port';
import { PaymentModuleAdapter } from './module_adapter';
import { PaymentController } from './presentation/controller';
import { createPaymentRouter } from './presentation/router';
import { InitiatePaymentUseCase } from './application/usecase/initiate-payment';
import { HandlePaymentCallbackUseCase } from './application/usecase/handle-payment-callback';
import { GetPaymentStatusUseCase } from './application/usecase/get-payment-status';
import { GetPaymentHistoryUseCase } from './application/usecase/get-payment-history';
import { VNPayGatewayService } from './infrastructure/vnpay-gateway';
import { MomoGatewayService } from './infrastructure/momo-gateway';
import { ZaloPayGatewayService } from './infrastructure/zalopay-gateway';
import { InMemoryPaymentStorage } from './infrastructure/payment-storage';

export class PaymentModule {
  public readonly router;
  public readonly publicApi: IPaymentModulePort;

  constructor() {
    // Initialize gateway services
    const gateways = new Map();
    gateways.set('vnpay', new VNPayGatewayService());
    gateways.set('momo', new MomoGatewayService());
    gateways.set('zalopay', new ZaloPayGatewayService());

    // Initialize storage
    const storage = new InMemoryPaymentStorage();

    // Initialize use cases
    const useCases = {
      initiatePayment: new InitiatePaymentUseCase(gateways, storage),
      handlePaymentCallback: new HandlePaymentCallbackUseCase(storage),
      getPaymentStatus: new GetPaymentStatusUseCase(storage),
      getPaymentHistory: new GetPaymentHistoryUseCase(storage),
    };

    // Create module adapter
    this.publicApi = new PaymentModuleAdapter(
      useCases.initiatePayment,
      useCases.handlePaymentCallback,
      useCases.getPaymentStatus,
      useCases.getPaymentHistory
    );

    // Create controller and router
    const controller = new PaymentController(this.publicApi);
    this.router = createPaymentRouter(controller);
  }
}

export const paymentModule = new PaymentModule();
export const paymentPublicApi = paymentModule.publicApi;
