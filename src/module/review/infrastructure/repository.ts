import { injectable } from 'tsyringe';
import { AppDataSource } from '@/config';
import {
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewListQueryDTO,
  PaginatedReviewsDTO,
  ReviewDetailDTO,
  RatingDistributionDTO,
  RatingSummaryDTO,
} from '../application/dtos';
import { IReviewRepository } from '../domain/interface';
import { ReviewEntity } from './reviewEntity';

function normalizeQuery(query: ReviewListQueryDTO): ReviewListQueryDTO {
  return {
    ...query,
    page: query.page > 0 ? query.page : 1,
    limit: query.limit > 0 ? Math.min(query.limit, 100) : 10,
  };
}

@injectable()
export class TypeORMReviewRepository implements IReviewRepository {
  private readonly reviewRepo = AppDataSource.getRepository(ReviewEntity);

  constructor() {}

  // 🔹 Check product exists
  async checkProductExists(productId: number): Promise<boolean> {
    const result = await AppDataSource.query(
      `SELECT 1 FROM products WHERE id = $1 LIMIT 1`,
      [productId]
    );
    return result.length > 0;
  }

  // 🔹 Check order owner
  async isOrderOwner(accountId: number, orderId: number): Promise<boolean> {
    const result = await AppDataSource.query(
      `SELECT 1 FROM orders WHERE id = $1 AND account_id = $2 LIMIT 1`,
      [orderId, accountId]
    );
    return result.length > 0;
  }

  // 🔹 Check delivered
  async isOrderDelivered(orderId: number): Promise<boolean> {
    const result = await AppDataSource.query(
      `SELECT status FROM orders WHERE id = $1 LIMIT 1`,
      [orderId]
    );
    return result[0]?.status === 'delivered';
  }

  // 🔹 Find duplicate
  async findByAccountProductOrder(
    accountId: number,
    productId: number,
    orderId: number
  ): Promise<ReviewDetailDTO | null> {
    const review = await this.reviewRepo.findOne({
      where: { accountId, productId, orderId },
    });

    if (!review) return null;

    return this.mapToDTO(review);
  }

  // 🔹 Find by id
  async findById(reviewId: number): Promise<ReviewDetailDTO | null> {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    return review ? this.mapToDTO(review) : null;
  }

  // 🔹 Create
  async createReview(dto: CreateReviewDTO): Promise<ReviewDetailDTO> {
    const created = await this.reviewRepo.save(
      this.reviewRepo.create({
        productId: dto.productId,
        accountId: dto.accountId,
        orderId: dto.orderId,
        rating: dto.rating,
        content: dto.content,
      })
    );

    return this.mapToDTO(created);
  }

  // 🔹 Update
  async updateReview(
    reviewId: number,
    dto: UpdateReviewDTO
  ): Promise<ReviewDetailDTO | null> {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });

    if (!review) return null;

    if (dto.rating !== undefined) review.rating = dto.rating;
    if (dto.content !== undefined) review.content = dto.content;

    await this.reviewRepo.save(review);

    return this.mapToDTO(review);
  }

  async deleteReview(reviewId: number): Promise<boolean> {
    const result = await this.reviewRepo.delete({ id: reviewId });
    return (result.affected ?? 0) > 0;
  }

  // 🔹 List (pagination)
  async listReviews(queryRaw: ReviewListQueryDTO): Promise<PaginatedReviewsDTO> {
    const query = normalizeQuery(queryRaw);

    const qb = this.reviewRepo.createQueryBuilder('r');

    if (query.productId) {
      qb.andWhere('r.product_id = :productId', { productId: query.productId });
    }

    qb.orderBy('r.created_at', 'DESC');

    qb.skip((query.page - 1) * query.limit).take(query.limit);

    const [rows, total] = await qb.getManyAndCount();

    return {
      items: rows.map((r) => this.mapToDTO(r)),
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  // 🔹 Rating summary
  async getRatingSummary(productId: number): Promise<RatingSummaryDTO> {
    const aggregate = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('r.product_id = :productId', { productId })
      .getRawOne();

    const distributionRows = await this.reviewRepo
      .createQueryBuilder('r')
      .select('r.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .where('r.product_id = :productId', { productId })
      .groupBy('r.rating')
      .getRawMany<{ rating: string; count: string }>();

    const ratingDistribution: RatingDistributionDTO = {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0,
    };

    for (const row of distributionRows) {
      const rating = row.rating as keyof RatingDistributionDTO;

      if (rating in ratingDistribution) {
        ratingDistribution[rating] = Number(row.count);
      }
    }

    const avg = Number(aggregate?.avg ?? 0);
    const count = Number(aggregate?.count ?? 0);

    return {
      productId,
      averageRating: Number(avg.toFixed(2)),
      totalReviews: count,
      ratingDistribution,
    };
  }

  // 🔹 Mapper
  private mapToDTO(entity: ReviewEntity): ReviewDetailDTO {
    return {
      id: entity.id,
      productId: entity.productId,
      accountId: entity.accountId,
      orderId: entity.orderId,
      rating: entity.rating,
      content: entity.content,
      createdAt: entity.createdAt,
    };
  }
}
