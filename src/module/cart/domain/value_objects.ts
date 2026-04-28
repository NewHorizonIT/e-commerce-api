import { InvalidQuantityError, NegativeQuantityResultError } from "./errors";

export class Quantity {
    public readonly value: number;

    constructor(value: number) {
        if (!Number.isInteger(value) || value < 0) {
            throw new InvalidQuantityError();
        }

        this.value = value;
    }

    //một số hàm tiện ích
    public equals(other: Quantity): boolean {
        return this.value === other.value;
    }

    public add(other: Quantity): Quantity {
        return new Quantity(this.value + other.value);
    }

    public subtract(other: Quantity): Quantity {
        if (this.value < other.value) {
            throw new NegativeQuantityResultError();
        }
        return new Quantity(this.value - other.value);
    }

    public isZero(): boolean {
        return this.value === 0;
    }

    public getValue(): number{
        return this.value;
    }
}