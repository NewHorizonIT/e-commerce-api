import { RatingValue, ReviewContent } from './value_objects';

export class Review {
  private constructor(
    private readonly id: number | null,
    private productId: number,
    private accountId: number,
    private orderId: number,
    private rating: RatingValue,
    private content: ReviewContent,
    private createdAt: Date
  ) {}

  // 🔹 create new review
  static create(params: {
    productId: number;
    accountId: number;
    orderId: number;
    rating: RatingValue;
    content: ReviewContent;
  }): Review {
    return new Review(
      null,
      params.productId,
      params.accountId,
      params.orderId,
      params.rating,
      params.content,
      new Date()
    );
  }

  // 🔹 rehydrate từ DB
  static rehydrate(params: {
    id: number;
    productId: number;
    accountId: number;
    orderId: number;
    rating: RatingValue;
    content: ReviewContent;
    createdAt: Date;
  }): Review {
    return new Review(
      params.id,
      params.productId,
      params.accountId,
      params.orderId,
      params.rating,
      params.content,
      params.createdAt
    );
  }

  // ===== getters =====
  getId(): number | null {
    return this.id;
  }

  getProductId(): number {
    return this.productId;
  }

  getAccountId(): number {
    return this.accountId;
  }

  getOrderId(): number {
    return this.orderId;
  }

  getRating(): number {
    return this.rating.value;
  }

  getContent(): string | null {
    return this.content.value;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
