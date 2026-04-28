import { IDiscountModulePort } from './application/module_port';
import { TypeORMDiscountRepository } from './infrastructure/repository';
import { DiscountModuleAdapter } from './module_adapter';
import { DiscountController } from './presentation/controller';
import { createDiscountRouter } from './presentation/router';
import { ListDiscountsUseCase } from './application/usecase/list-discounts';
import { FindDiscountByIdUseCase } from './application/usecase/find-discount-by-id';
import { FindDiscountByCodeUseCase } from './application/usecase/find-discount-by-code';
import { CreateDiscountUseCase } from './application/usecase/create-discount';
import { UpdateDiscountUseCase } from './application/usecase/update-discount';
import { UpdateActiveDiscountUseCase } from './application/usecase/update-active-discount';
import { CheckDiscountValidityUseCase } from './application/usecase/check-discount-validity';

export class DiscountModule {
  public readonly router;
  public readonly publicApi: IDiscountModulePort;

  constructor() {
    const discountRepository = new TypeORMDiscountRepository();

    const useCases = {
      listDiscounts: new ListDiscountsUseCase(discountRepository),
      findDiscountById: new FindDiscountByIdUseCase(discountRepository),
      findDiscountByCode: new FindDiscountByCodeUseCase(discountRepository),
      createDiscount: new CreateDiscountUseCase(discountRepository),
      updateDiscount: new UpdateDiscountUseCase(discountRepository),
      updateActiveDiscount: new UpdateActiveDiscountUseCase(discountRepository),
      checkDiscountValidity: new CheckDiscountValidityUseCase(discountRepository),
    };
    this.publicApi = new DiscountModuleAdapter(useCases);

    const controller = new DiscountController(this.publicApi);
    this.router = createDiscountRouter(controller);
  }
}

export const discountModule = new DiscountModule();
export const discountPublicApi = discountModule.publicApi;
