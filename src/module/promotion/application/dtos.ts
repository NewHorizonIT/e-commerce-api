import { PromotionStatusEnum, PromotionTypeEnum } from "../domain/value_objects";

// mặc định create draft, danh sách rỗng
export interface CreatePromotionProgramDTO {
    name: string;
    startTime: string;
    endTime: string;
}

export interface UpdatePromotionProgramDTO {
    name?: string;
    startTime?: string;
    endTime?: string;
    status?: PromotionStatusEnum;
    details?: PromotionDetailDTO[];
}

export interface PromotionProgramDTO {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    status: PromotionStatusEnum;
    details: PromotionDetailDTO[];
}

export interface PromotionDetailDTO {
    id?: number;
    type: PromotionTypeEnum;
    promotionValue: number;
    productLimit: number;
    usageLimitPerCustomer: number;
    promotionProgramId: number;
    variantId: number;
}