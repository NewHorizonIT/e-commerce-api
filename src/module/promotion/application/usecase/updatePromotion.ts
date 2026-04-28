import { inject, injectable } from "tsyringe";
import { PROMOTION_TOKENS } from "../../tokens";
import { IPromotionRepository } from "../../domain/interface";
import { PromotionProgramDTO, UpdatePromotionProgramDTO } from '../dtos';
import { PromotionStatus, PromotionType } from "../../domain/value_objects";
import { NotFoundPromotionByIdError } from "./errors";
import { PromotionDetail } from "../../domain/domain";
import { PromotionDTOMapper } from "./mapper";

@injectable()
export default class UpdatePromotionUseCase {
  constructor(
    @inject(PROMOTION_TOKENS.IPromotionRepository)
    private readonly promotionRepository: IPromotionRepository
  ) { }

  async execute(promotionProgramDTO: UpdatePromotionProgramDTO, id: number): Promise<PromotionProgramDTO> {
    const existingPromotion = await this.promotionRepository.findById(id);

    if (!existingPromotion) {
      throw new NotFoundPromotionByIdError(id);
    }

    if (promotionProgramDTO.name) existingPromotion.updateName(promotionProgramDTO.name);
    const { startTime, endTime } = promotionProgramDTO;

    if (startTime || endTime) {
      existingPromotion.updateTime({
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      });
    }
    if (promotionProgramDTO.status) existingPromotion.updateStatus(new PromotionStatus(promotionProgramDTO.status));

    //frontend cần gửi danh sách detail đầy đủ thuộc tính
    if (promotionProgramDTO.details) {
      // check theo id detail, nếu tồn tại thì update domain cũ, nếu chưa tồn tại thì tạo doamin mới
      const allDetails = promotionProgramDTO.details.map(dto => {
        const existing = dto.id
          ? existingPromotion.getDetails().find(dt => dt.getRequiredId() === dto.id)
          : null;

        if (existing) {
          existing.updateProductLimit(dto.productLimit);
          existing.updatePromotionValue(dto.promotionValue);
          existing.updateType(new PromotionType(dto.type));
          existing.updateUsageLimitPerCustomer(dto.usageLimitPerCustomer);
          existing.updateVariant(dto.variantId);
          return existing;
        }

        // 3. Nếu không có (id null hoặc id không khớp): Tạo mới
        return PromotionDetail.create({
          type: new PromotionType(dto.type),
          promotionValue: dto.promotionValue,
          productLimit: dto.productLimit,
          usageLimitPerCustomer: dto.usageLimitPerCustomer,
          variantId: dto.variantId
        });
      });

      existingPromotion.updateDetails(allDetails);
    }
    const updatedPromotion = await this.promotionRepository.save(existingPromotion);

    return PromotionDTOMapper.ToDTO(updatedPromotion);
  }
}