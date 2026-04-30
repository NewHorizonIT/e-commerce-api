import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, } from 'typeorm';
import { PromotionStatus, PromotionStatusEnum, PromotionType, PromotionTypeEnum } from '../domain/value_objects';
import { PromotionDetail, PromotionProgram } from '../domain/domain';

@Entity('promotion_programs')
export class PromotionProgramEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'timestamp' })
    startTime!: Date;

    @Column({ type: 'timestamp' })
    endTime!: Date;

    @Column({
        type: 'enum',
        enum: PromotionStatusEnum,
        default: PromotionStatusEnum.DRAFT,
    })
    status!: PromotionStatusEnum;

    @OneToMany(() => PromotionDetailEntity, (detail) => detail.promotionProgram)
    details!: PromotionDetailEntity[];
}

@Entity('promotion_details')
export class PromotionDetailEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'enum',
        enum: PromotionTypeEnum,
    })
    type!: PromotionTypeEnum;

    @Column({
        type: 'decimal', precision: 12, scale: 3,
        //chuyển string từ DB sang number trong code
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    promotionValue!: number;

    @Column({ type: 'int' })
    productLimit!: number;

    @Column({ type: 'int' })
    usageLimitPerCustomer!: number;

    @Column({ type: 'int' })
    promotionProgramId!: number;

    @Column({ type: 'int' })
    variantId!: number;

    @ManyToOne(() => PromotionProgramEntity, (program) => program.details, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'promotionProgramId' })
    promotionProgram!: PromotionProgramEntity;
}

export class PromotionMapper {
    static toDomain(promotionEntity: PromotionProgramEntity, detailEntities: PromotionDetailEntity[]): PromotionProgram {
        const details = detailEntities.map(detail => (
            PromotionDetail.rehydrate({
                id: detail.id,
                type: new PromotionType(detail.type),
                promotionValue: detail.promotionValue,
                productLimit: detail.productLimit,
                usageLimitPerCustomer: detail.usageLimitPerCustomer,
                variantId: detail.variantId
            })
        ))
        return PromotionProgram.rehydrate({
            id: promotionEntity.id,
            name: promotionEntity.name,
            startTime: promotionEntity.startTime,
            endTime: promotionEntity.endTime,
            status: new PromotionStatus(promotionEntity.status),
            details: details
        });
    }

    static toEntity(domain: PromotionProgram): { promotionEntity: PromotionProgramEntity, detailEntities: PromotionDetailEntity[] } {
        const promotionEntity = new PromotionProgramEntity();
        const domainId = domain.getId();
        const detailEntities: PromotionDetailEntity[] = domain.getDetails().map(detail => {
            const detailEntity = new PromotionDetailEntity();
            const id = detail.getId();
            if (id !== null) {
                detailEntity.id = id;
            }
            detailEntity.type = detail.getType().value;
            detailEntity.promotionValue = detail.getPromotionValue();
            detailEntity.productLimit = detail.getProductLimit();
            detailEntity.usageLimitPerCustomer = detail.getUsageLimitPerCustomer();
            detailEntity.variantId = detail.getVariantId();
            return detailEntity;
        });

        if (domainId !== null) {
            promotionEntity.id = domainId;
        }
        promotionEntity.name = domain.getName();
        promotionEntity.startTime = domain.getStartTime();
        promotionEntity.endTime = domain.getEndTime();
        promotionEntity.status = domain.getStatus().value;

        return { promotionEntity, detailEntities };
    }
}