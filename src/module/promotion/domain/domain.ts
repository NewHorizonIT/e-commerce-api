import { UnexpectedMissingPromotionDetailIdError, UnexpectedMissingPromotionIdError } from "./errors";
import { PromotionStatus, PromotionType } from "./value_objects";

export class PromotionProgram {
    private id: number | null;
    private name: string;
    private startTime: Date;
    private endTime: Date;
    private status: PromotionStatus;
    
    private constructor(
        id: number | null,
        name: string,
        startTime: Date,
        endTime: Date,
        status: PromotionStatus
    ) {
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    public static create(params: { name: string; startTime: Date, endTime: Date, status: PromotionStatus }): PromotionProgram {
        return new PromotionProgram(null, params.name, params.startTime, params.endTime, params.status);
    }

    public static rehydrate(params: {
        id: number;
        name: string;
        startTime: Date;
        endTime: Date;
        status: PromotionStatus;
    }): PromotionProgram {
        return new PromotionProgram(
            params.id,
            params.name,
            params.startTime,
            params.endTime,
            params.status
        );
    }

    public getId(): number | null {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getStartTime(): Date {
        return this.startTime;
    }

    public getEndTime(): Date {
        return this.endTime;
    }

    public getStatus(): PromotionStatus {
        return this.status;
    }

    public getRequiredId(){
        if(this.id === null){
            throw new UnexpectedMissingPromotionIdError();
        }
        return this.id;
    }
}

export class PromotionDetail {
    private id: number | null;
    private type: PromotionType;
    private promotionValue: number;
    private productLimit: number;
    private usageLimitPerCustomer: number;
    private promotionProgramId: number;
    private variantId: number;

    private constructor(
        id: number | null,
        type: PromotionType,
        promotionValue: number,
        productLimit: number,
        usageLimitPerCustomer: number,
        promotionProgramId: number,
        variantId: number
    ) {
        this.id = id;
        this.type = type;
        this.promotionValue = promotionValue;
        this.productLimit = productLimit;
        this.usageLimitPerCustomer = usageLimitPerCustomer;
        this.promotionProgramId = promotionProgramId;
        this.variantId = variantId;
    }

    public static create(params: {
        type: PromotionType;
        promotionValue: number;
        productLimit: number;
        usageLimitPerCustomer: number;
        promotionProgramId: number;
        variantId: number;
    }): PromotionDetail {
        return new PromotionDetail(
            null,
            params.type,
            params.promotionValue,
            params.productLimit,
            params.usageLimitPerCustomer,
            params.promotionProgramId,
            params.variantId
        );
    }

    public static rehydrate(params: {
        id: number;
        type: PromotionType;
        promotionValue: number;
        productLimit: number;
        usageLimitPerCustomer: number;
        promotionProgramId: number;
        variantId: number;
    }): PromotionDetail {
        return new PromotionDetail(
            params.id,
            params.type,
            params.promotionValue,
            params.productLimit,
            params.usageLimitPerCustomer,
            params.promotionProgramId,
            params.variantId
        );
    }

    public getId(): number | null {
        return this.id;
    }

    public getRequiredId(): number {
        if (this.id === null) {
            throw new UnexpectedMissingPromotionDetailIdError();
        }
        return this.id;
    }

    public getType(): PromotionType {
        return this.type;
    }

    public getPromotionValue(): number {
        return this.promotionValue;
    }

    public getProductLimit(): number {
        return this.productLimit;
    }

    public getUsageLimitPerCustomer(): number {
        return this.usageLimitPerCustomer;
    }

    public getPromotionProgramId(): number {
        return this.promotionProgramId;
    }

    public getVariantId(): number {
        return this.variantId;
    }
}