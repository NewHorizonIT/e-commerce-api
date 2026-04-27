import { PromotionProgram } from "../../domain/domain";
import { PromotionDetailDTO, PromotionProgramDTO } from "../dtos";

export class PromotionDTOMapper {
    static ToDTO(promotionProgram: PromotionProgram): PromotionProgramDTO{
    const promotionProgramDTO: PromotionProgramDTO = {
      id: promotionProgram.getRequiredId(),
      name: promotionProgram.getName(),
      startTime: promotionProgram.getStartTime().toISOString(),
      endTime: promotionProgram.getEndTime().toISOString(),
      status: promotionProgram.getStatus().value,
      details: promotionProgram.getDetails().map(detail => {
        const promotionDetailDTO: PromotionDetailDTO = {
          id: detail.getRequiredId(),
          productLimit: detail.getProductLimit(),
          promotionProgramId: promotionProgram.getRequiredId(),
          promotionValue: detail.getPromotionValue(),
          type: detail.getType().value,
          usageLimitPerCustomer: detail.getUsageLimitPerCustomer(),
          variantId: detail.getVariantId()
        }
        return promotionDetailDTO;
      })
    }
    return promotionProgramDTO;
  }
}