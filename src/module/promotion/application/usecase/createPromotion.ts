import { inject, injectable } from "tsyringe";
import { PROMOTION_TOKENS } from "../../tokens";
import { IPromotionRepository } from "../../domain/interface";
import { CreatePromotionProgramDTO, PromotionProgramDTO } from "../dtos";
import { PromotionProgram } from "../../domain/domain";
import { PromotionDTOMapper } from "./mapper";
import { InvalidTimeRangeError, StartTimeInPastError } from "./errors";

// tạo promotion draft với danh sách detail rỗng
@injectable()
export default class CreatePromotionUseCase {
  constructor(
    @inject(PROMOTION_TOKENS.IPromotionRepository)
    private readonly promotionRepository: IPromotionRepository
  ) {}

  async execute(createPromotionProgramDTO: CreatePromotionProgramDTO): Promise<PromotionProgramDTO>{
    const promotion = PromotionProgram.create({
      name: createPromotionProgramDTO.name,
      startTime: new Date(createPromotionProgramDTO.startTime),
      endTime: new Date(createPromotionProgramDTO.endTime)
    });

    if (new Date(createPromotionProgramDTO.startTime) >= new Date(createPromotionProgramDTO.endTime)) {
      throw new InvalidTimeRangeError(createPromotionProgramDTO.startTime, createPromotionProgramDTO.endTime);
    }

    if(new Date(createPromotionProgramDTO.startTime) <= new Date()){
      throw new StartTimeInPastError(createPromotionProgramDTO.startTime);
    }

    const savedPromotion = await this.promotionRepository.save(promotion);

    const response: PromotionProgramDTO = PromotionDTOMapper.ToDTO(savedPromotion);

    return response;
  }
}