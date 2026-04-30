import { inject, injectable } from "tsyringe";
import { PROMOTION_TOKENS } from "../../tokens";
import { IPromotionRepository } from "../../domain/interface";
import { PromotionDTOMapper } from "./mapper";
import { PromotionProgramDTO } from "../dtos";

@injectable()
export default class GetAllPromotionUseCase {
  constructor(
    @inject(PROMOTION_TOKENS.IPromotionRepository)
    private readonly promotionRepository: IPromotionRepository
  ) {}

  async execute(): Promise<PromotionProgramDTO[]>{
    const promotionPrograms = await this.promotionRepository.getAll();
    return promotionPrograms.map(promotionProgram => (PromotionDTOMapper.ToDTO(promotionProgram)));
  }
}