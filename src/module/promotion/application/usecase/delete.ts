import { inject, injectable } from "tsyringe";
import { PROMOTION_TOKENS } from "../../tokens";
import { IPromotionRepository } from "../../domain/interface";

@injectable()
export default class DeletePromotionUseCase {
  constructor(
    @inject(PROMOTION_TOKENS.IPromotionRepository)
    private readonly promotionRepository: IPromotionRepository
  ) {}

  async execute(id: number): Promise<void>{
    await this.promotionRepository.delete(id);
  }
}