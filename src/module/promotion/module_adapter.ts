import { inject, injectable } from "tsyringe";
import { IPromotionModulePort } from "./application/module_port";
import { PromotionProgramDTO, CreatePromotionProgramDTO, UpdatePromotionProgramDTO } from "./application/dtos";
import GetAllPromotionUseCase from "./application/usecase/getAllPromotion";
import CreatePromotionUseCase from './application/usecase/createPromotion';
import UpdatePromotionUseCase from "./application/usecase/updatePromotion";
import DeletePromotionUseCase from "./application/usecase/delete";

@injectable()
export class PromotionModuleAdapter implements IPromotionModulePort {
    constructor(
        @inject(GetAllPromotionUseCase)
        private readonly getAllPromotionUseCase: GetAllPromotionUseCase,
        @inject(CreatePromotionUseCase)
        private readonly createPromotionUseCase: CreatePromotionUseCase,
        @inject(UpdatePromotionUseCase)
        private readonly updatePromoitonUseCase: UpdatePromotionUseCase,
        @inject(DeletePromotionUseCase)
        private readonly deletePromotionUseCase: DeletePromotionUseCase,
    ) { }
    getAllPromotion(): Promise<PromotionProgramDTO[]> {
        return this.getAllPromotionUseCase.execute();
    }
    createPromotion(promotionProgram: CreatePromotionProgramDTO): Promise<PromotionProgramDTO> {
        return this.createPromotionUseCase.execute(promotionProgram);
    }
    updatePromotion(promotionProgramDTO: UpdatePromotionProgramDTO, id: number): Promise<PromotionProgramDTO> {
        return this.updatePromoitonUseCase.execute(promotionProgramDTO, id);
    }
    deletePromotion(id: number): Promise<void> {
        return this.deletePromotionUseCase.execute(id);
    }
}