import { CreatePromotionProgramDTO, PromotionProgramDTO, UpdatePromotionProgramDTO } from './dtos';

export interface IPromotionModulePort {
    getAllPromotion(): Promise<PromotionProgramDTO[]>;
    createPromotion(promotionProgram: CreatePromotionProgramDTO): Promise<PromotionProgramDTO>;
    updatePromotion(promotionProgramDTO: UpdatePromotionProgramDTO, id: number): Promise<PromotionProgramDTO>;
    deletePromotion(id: number): Promise<void>;
    deleteDetailByVariantId(id: number, variantId: number): Promise<void>;
}