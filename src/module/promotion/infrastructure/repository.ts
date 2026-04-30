import { injectable } from "tsyringe";
import { In, Not, Repository } from "typeorm";
import { IPromotionRepository } from "../domain/interface";
import { PromotionProgram } from "../domain/domain";
import { AppDataSource } from "@/config";
import { PromotionDetailEntity, PromotionMapper, PromotionProgramEntity } from "./promotionEntity";
import { NotFoundPromotionError } from "./errors";

@injectable()
export class TypeORMPromotionRepository implements IPromotionRepository {
    private readonly promotionRepo: Repository<PromotionProgramEntity>;
    constructor() {
        this.promotionRepo = AppDataSource.getRepository(PromotionProgramEntity);
    }

    async findById(id: number): Promise<PromotionProgram | null> {
        const promotionEntity = await this.promotionRepo.findOne({
            where: { id: id },
            relations: ["details"]
        });

        return promotionEntity ? PromotionMapper.toDomain(promotionEntity, promotionEntity.details) : null;
    }

    async getAll(): Promise<PromotionProgram[]> {
        const promotionEntities = await this.promotionRepo.find({
            relations: ["details"]
        });
        return promotionEntities.map(entity => (PromotionMapper.toDomain(entity, entity.details)));
    }

    //tối ưu cần frontend gửi thêm trường id cho detail
    async save(promotion: PromotionProgram): Promise<PromotionProgram> {
        const { promotionEntity, detailEntities } = PromotionMapper.toEntity(promotion);

        //dùng transactionalEntityManager để lưu dữ liệu, rollback tất cả khi lỗi 
        const updatedPromotionEntity = await AppDataSource.transaction(async (transactionalEntityManager) => {

            const savedPromotionEntity = await transactionalEntityManager.save(promotionEntity);
            const promotionProgramId = savedPromotionEntity.id;

            //1.Xóa item cần xóa
            const currentDetailIds = detailEntities.map(item => item.id).filter(id => id);
            //not in có thể lỗi khi currentItemIds rỗng
            if (currentDetailIds.length === 0) {
                await transactionalEntityManager.delete(PromotionDetailEntity, { promotionProgramId: promotionProgramId });
            } else {
                await transactionalEntityManager.delete(PromotionDetailEntity, {
                    promotionProgramId: promotionProgramId,
                    id: Not(In(currentDetailIds))
                });
            }

            //2.Thêm hoặc cập nhật item mới
            detailEntities.forEach(item => item.promotionProgramId = promotionProgramId);
            const savedDetailEntities = await transactionalEntityManager.save(PromotionDetailEntity, detailEntities);
            return { savedPromotionEntity, savedDetailEntities };
        })

        return PromotionMapper.toDomain(updatedPromotionEntity.savedPromotionEntity, updatedPromotionEntity.savedDetailEntities);
    }

    async delete(id: number): Promise<void> {
        const result = await this.promotionRepo.delete(id);

        if (result.affected === 0) {
            throw new NotFoundPromotionError(id);
        }
    }
}
