import { inject, injectable } from "tsyringe";
import { PROMOTION_TOKENS } from "../../tokens";
import { IPromotionRepository } from "../../domain/interface";
import { NotFoundPromotionByIdError } from "./errors";

@injectable()
export default class DeletePromotionDetailUseCase {
  constructor(
    @inject(PROMOTION_TOKENS.IPromotionRepository)
    private readonly promotionRepository: IPromotionRepository
  ) {}

  async execute(id: number, variantId: number): Promise<void>{
    const promotion = await this.promotionRepository.findById(id);
    if(!promotion){
        throw new NotFoundPromotionByIdError(id);
    }
    promotion.deleteDetail(variantId);
    await this.promotionRepository.save(promotion);
  }
}