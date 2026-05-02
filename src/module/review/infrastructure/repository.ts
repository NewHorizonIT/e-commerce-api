import { injectable } from 'tsyringe';
import { AppDataSource } from '@/config';
import { MediaFileEntity } from '@/module/product/infarstructure/productEntity';
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

type ReviewBaseRow = {
  review_id: string;
  product_id: string;
  account_id: string;
  order_id: string;
  rating: string;
  content: string | null;
  created_at: string | Date;
  username: string | null;
  avatar_url: string | null;
};

type ReviewSelectedRow = {
  review_id: string;
  variant_id: string;
  variant_name: string;
  group_id: string;
  group_name: string;
  value_id: string;
  value: string;
  image_url: string | null;
};

type ReviewMediaRow = {
  id: string;
  review_id: string;
  url: string;
  file_type: 'image' | 'video' | string;
};

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
  private readonly mediaFileRepo = AppDataSource.getRepository(MediaFileEntity);

  constructor() {}

  // 🔹 Check product exists
  async checkProductExists(productId: number): Promise<boolean> {
    const result = await AppDataSource.query(`SELECT 1 FROM products WHERE id = $1 LIMIT 1`, [
      productId,
    ]);
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
    const result = await AppDataSource.query(`SELECT status FROM orders WHERE id = $1 LIMIT 1`, [
      orderId,
    ]);
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

    const hydrated = await this.loadReviewDetails([review.id]);
    return hydrated[0] ?? null;
  }

  // 🔹 Find by id
  async findById(reviewId: number): Promise<ReviewDetailDTO | null> {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });

    if (!review) {
      return null;
    }

    const hydrated = await this.loadReviewDetails([review.id]);
    return hydrated[0] ?? null;
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

    const hydrated = await this.loadReviewDetails([created.id]);

    if (!hydrated[0]) {
      throw new Error('Unexpected error: review not found after creation');
    }

    return hydrated[0];
  }

  // 🔹 Update
  async updateReview(reviewId: number, dto: UpdateReviewDTO): Promise<ReviewDetailDTO | null> {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });

    if (!review) return null;

    if (dto.rating !== undefined) review.rating = dto.rating;
    if (dto.content !== undefined) review.content = dto.content;

    await this.reviewRepo.save(review);

    const hydrated = await this.loadReviewDetails([review.id]);
    return hydrated[0] ?? null;
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
    const hydrated = await this.loadReviewDetails(rows.map((row) => row.id));
    const hydratedById = new Map(hydrated.map((review) => [review.id, review]));

    return {
      items: rows.map((row) => hydratedById.get(row.id) ?? this.mapToDTO(row)),
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
      idUser: entity.accountId,
      username: `user-${entity.accountId}`,
      avatarUrl: null,
      orderId: entity.orderId,
      rating: entity.rating,
      content: entity.content,
      createdAt: entity.createdAt,
      selectedAttributes: [],
      media: [],
    };
  }

  private async loadReviewDetails(reviewIds: number[]): Promise<ReviewDetailDTO[]> {
    if (!reviewIds.length) {
      return [];
    }

    const baseRows = (await AppDataSource.query(
      `
        SELECT
          r.id AS review_id,
          r.product_id,
          r.account_id,
          r.order_id,
          r.rating,
          r.content,
          r.created_at,
          COALESCE(pi.name, CONCAT('user-', r.account_id)) AS username,
          pi.avatar_url AS avatar_url
        FROM reviews r
        LEFT JOIN personal_informations pi ON pi.account_id = r.account_id
        WHERE r.id = ANY($1)
      `,
      [reviewIds]
    )) as ReviewBaseRow[];

    const selectedRows = (await AppDataSource.query(
      `
        SELECT
          r.id AS review_id,
          oi.variant_id,
          oi.variant_name_snapshot AS variant_name,
          vg.id AS group_id,
          vg.name AS group_name,
          vv.id AS value_id,
          vv.value,
          vv.image_url AS image_url
        FROM reviews r
        INNER JOIN order_items oi ON oi.order_id = r.order_id
        INNER JOIN variants v ON v.id = oi.variant_id AND v.product_id = r.product_id
        INNER JOIN variant_details vd ON vd.variant_id = v.id
        INNER JOIN variant_values vv ON vv.id = vd.variant_value_id
        INNER JOIN variant_groups vg ON vg.id = vv.variant_group_id
        WHERE r.id = ANY($1)
        ORDER BY r.id DESC, vg.display_order ASC, vg.id ASC, vv.id ASC
      `,
      [reviewIds]
    )) as ReviewSelectedRow[];

    const mediaRows = await this.loadReviewMediaRows(reviewIds);

    const reviewMap = new Map<number, ReviewDetailDTO>();

    for (const row of baseRows) {
      const reviewId = Number(row.review_id);

      reviewMap.set(reviewId, {
        id: reviewId,
        productId: Number(row.product_id),
        accountId: Number(row.account_id),
        idUser: Number(row.account_id),
        username: row.username ?? `user-${row.account_id}`,
        avatarUrl: row.avatar_url ?? null,
        orderId: Number(row.order_id),
        rating: Number(row.rating),
        content: row.content,
        createdAt: new Date(row.created_at),
        selectedAttributes: [],
        media: [],
      });
    }

    for (const row of selectedRows) {
      const review = reviewMap.get(Number(row.review_id));

      if (!review) {
        continue;
      }

      review.selectedAttributes.push({
        variantId: Number(row.variant_id),
        variantName: row.variant_name,
        groupId: Number(row.group_id),
        groupName: row.group_name,
        valueId: Number(row.value_id),
        value: row.value,
        imageUrl: row.image_url,
      });
    }

    for (const row of mediaRows) {
      const review = reviewMap.get(Number(row.review_id));

      if (!review) {
        continue;
      }

      review.media.push({
        id: Number(row.id),
        url: row.url,
        fileType: row.file_type === 'video' ? 'video' : 'image',
      });
    }

    return reviewIds
      .map((reviewId) => reviewMap.get(reviewId))
      .filter((review): review is ReviewDetailDTO => Boolean(review));
  }

  private async loadReviewMediaRows(reviewIds: number[]): Promise<ReviewMediaRow[]> {
    try {
      const rows = await this.mediaFileRepo.find({
        where: {
          entityType: 'review',
        },
        order: {
          id: 'ASC',
        },
      });

      return rows
        .filter((row) => reviewIds.includes(row.entityId))
        .map((row) => ({
          id: String(row.id),
          review_id: String(row.entityId),
          url: row.url,
          file_type: row.fileType,
        }));
    } catch {
      return [];
    }
  }
}
