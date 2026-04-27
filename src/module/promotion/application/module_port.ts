import { CreatePromotionProgramDTO, PromotionDetailDTO, PromotionProgramDTO } from './dtos';

export interface IPromotionModulePort {
    getAllPromotion(): Promise<PromotionProgramDTO[]>;
    createPromotion(promotionProgram: CreatePromotionProgramDTO): Promise<PromotionProgramDTO>;
    updatePromotion(promotionDetail: PromotionDetailDTO[]): Promise<PromotionProgramDTO>;
    delete(id: number): Promise<void>;
}