import { RatingValue, ReviewContent } from './value_objects';

export class Review {
  private constructor(
    private readonly id: number | null,
    private productId: number,
    private accountId: number,
    private orderId: number,
    private rating: RatingValue,
    private content: ReviewContent,
    private createdAt: Date,
    private mediaUrls: string[] = []
  ) {}

  // 🔹 create new review
  static create(params: {
    productId: number;
    accountId: number;
    orderId: number;
    rating: RatingValue;
    content: ReviewContent;
    mediaUrls?: string[];
  }): Review {
    return new Review(
      null,
      params.productId,
      params.accountId,
      params.orderId,
      params.rating,
      params.content,
      new Date(),
      params.mediaUrls || []
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
    mediaUrls?: string[];
  }): Review {
    return new Review(
      params.id,
      params.productId,
      params.accountId,
      params.orderId,
      params.rating,
      params.content,
      params.createdAt,
      params.mediaUrls || []
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

  getMediaUrls(): string[] {
    return this.mediaUrls;
  }
}
