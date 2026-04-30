import { InvalidTimeRangeError, UnexpectedMissingPromotionDetailIdError, UnexpectedMissingPromotionIdError } from "./errors";
import { PromotionStatus, PromotionType } from "./value_objects";

export class PromotionProgram {
    private id: number | null;
    private name: string;
    private startTime: Date;
    private endTime: Date;
    private status: PromotionStatus;
    private details: PromotionDetail[];

    private constructor(
        id: number | null,
        name: string,
        startTime: Date,
        endTime: Date,
        status: PromotionStatus,
        details: PromotionDetail[]
    ) {
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.details = details;
    }

    public static create(params: { name: string; startTime: Date, endTime: Date, status?: PromotionStatus, details?: PromotionDetail[] }): PromotionProgram {
        const promotionStatus: PromotionStatus = params.status ?? PromotionStatus.draft();
        const promotionDetails: PromotionDetail[] = params.details ?? [];
        return new PromotionProgram(null, params.name, params.startTime, params.endTime, promotionStatus, promotionDetails);
    }

    public static rehydrate(params: {
        id: number;
        name: string;
        startTime: Date;
        endTime: Date;
        status: PromotionStatus;
        details: PromotionDetail[]
    }): PromotionProgram {
        return new PromotionProgram(
            params.id,
            params.name,
            params.startTime,
            params.endTime,
            params.status,
            params.details
        );
    }

    public removeDetail(id: number){
        const newDetail = this.details.filter(detail => detail.getRequiredId() !== id);
        this.updateDetails(newDetail);
    }

    public deleteDetail(variantId: number){
        const newDetail = this.details.filter(detail => detail.getVariantId() !== variantId);
        this.updateDetails(newDetail);
    }

    public updateDetails(newDetails: PromotionDetail[]) {
        this.details = [...newDetails];
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

    public getRequiredId() {
        if (this.id === null) {
            throw new UnexpectedMissingPromotionIdError();
        }
        return this.id;
    }

    public getDetails() {
        return [...this.details];
    }

    public updateName(newName: string) {
        this.name = newName;
    }

    public updateTime(params: {
        startTime?: Date;
        endTime?: Date;
    }): void {
        const newStart = params.startTime ?? this.startTime;
        const newEnd = params.endTime ?? this.endTime;

        if (newStart >= newEnd) {
            throw new InvalidTimeRangeError(newStart, newEnd);
        }

        this.startTime = newStart;
        this.endTime = newEnd;
    }

    public updateStatus(newStatus: PromotionStatus) {
        this.status = newStatus;
    }

}

export class PromotionDetail {
    private id: number | null;
    private type: PromotionType;
    private promotionValue: number;
    private productLimit: number;
    private usageLimitPerCustomer: number;
    private variantId: number;

    private constructor(
        id: number | null,
        type: PromotionType,
        promotionValue: number,
        productLimit: number,
        usageLimitPerCustomer: number,
        variantId: number
    ) {
        this.id = id;
        this.type = type;
        this.promotionValue = promotionValue;
        this.productLimit = productLimit;
        this.usageLimitPerCustomer = usageLimitPerCustomer;
        this.variantId = variantId;
    }

    public static create(params: {
        type: PromotionType;
        promotionValue: number;
        productLimit: number;
        usageLimitPerCustomer: number;
        variantId: number;
    }): PromotionDetail {
        return new PromotionDetail(
            null,
            params.type,
            params.promotionValue,
            params.productLimit,
            params.usageLimitPerCustomer,
            params.variantId
        );
    }

    public static rehydrate(params: {
        id: number;
        type: PromotionType;
        promotionValue: number;
        productLimit: number;
        usageLimitPerCustomer: number;
        variantId: number;
    }): PromotionDetail {
        return new PromotionDetail(
            params.id,
            params.type,
            params.promotionValue,
            params.productLimit,
            params.usageLimitPerCustomer,
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

    public getVariantId(): number {
        return this.variantId;
    }

    public updatePromotionValue(value: number): void {
        this.promotionValue = value;
    }

    public updateType(type: PromotionType): void {
        this.type = type;
    }

    public updateProductLimit(limit: number): void {
        this.productLimit = limit;
    }

    public updateUsageLimitPerCustomer(limit: number): void {
        this.usageLimitPerCustomer = limit;
    }

    public updateVariant(variantId: number): void {
        this.variantId = variantId;
    }
}