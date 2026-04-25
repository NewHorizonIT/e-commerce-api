import { InvalidPromotionStatusError, InvalidPromotionTypeError } from "./errors";

export enum PromotionStatusEnum {
    DRAFT = 'draft',
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export class PromotionStatus {
    public value: PromotionStatusEnum;

    constructor(value: string) {
        if (!Object.values(PromotionStatusEnum).includes(value as PromotionStatusEnum)) {
            throw new InvalidPromotionStatusError(value);
        }
        this.value = value as PromotionStatusEnum;
    }

    public static draft(): PromotionStatus {
        return new PromotionStatus(PromotionStatusEnum.DRAFT);
    }

    public isDraft(): boolean { 
        return this.value === PromotionStatusEnum.DRAFT; 
    }

    public isActive(): boolean { 
        return this.value === PromotionStatusEnum.ACTIVE; 
    }

    public isInactive(): boolean { 
        return this.value === PromotionStatusEnum.INACTIVE; 
    }
}

export enum PromotionTypeEnum {
    FIXED = "fixed",
    PERCENTAGE = "percentage"
}

export class PromotionType {
    public value: PromotionTypeEnum;

    constructor(value: string) {
        if (!Object.values(PromotionTypeEnum).includes(value as PromotionTypeEnum)) {
            throw new InvalidPromotionTypeError(value);
        }
        this.value = value as PromotionTypeEnum;
    }

    public isFixed(): boolean { 
        return this.value === PromotionTypeEnum.FIXED; 
    }

    public isPercentage(): boolean { 
        return this.value === PromotionTypeEnum.PERCENTAGE; 
    }
}