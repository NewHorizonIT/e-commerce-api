import { AppDataSource } from '@/config';
import { ORDER_STATUS_VALUE } from '@/module/order/domain/value_objects';
import { injectable } from 'tsyringe';
import type {
  RatingSummaryDTO,
  StatsOverviewDTO,
  StatsRangeQueryDTO,
  StatsStatusBreakdownDTO,
  StatsTrendDTO,
  StatsTrendPointDTO,
  TopSellingProductDTO,
  TopSpenderDTO,
} from '../application/dtos';
import type { IStatsRepository } from '../domain/interface';
import type { StatsGroupBy } from '../domain/value_objects';

@injectable()
export class TypeORMStatsRepository implements IStatsRepository {
  async getOverview(query: StatsRangeQueryDTO): Promise<StatsOverviewDTO> {
    const orderFilters = this.buildRangeClause('o.order_date', query.from, query.to);
    const accountFilters = this.buildRangeClause('a."createdDate"', query.from, query.to);

    const orderMetricsRows = await AppDataSource.query(
      `
        SELECT
          COALESCE(SUM(CASE WHEN o.is_paid THEN o.total_amount ELSE 0 END), 0) AS total_revenue,
          COUNT(*)::int AS total_orders,
          COALESCE(SUM(CASE WHEN o.is_paid THEN 1 ELSE 0 END), 0)::int AS paid_orders,
          COUNT(DISTINCT o.account_id)::int AS unique_customers
        FROM orders o
        WHERE 1=1${orderFilters.clause}
      `,
      orderFilters.params
    );

    const itemMetricsRows = await AppDataSource.query(
      `
        SELECT
          COALESCE(SUM(oi.quantity), 0)::int AS total_items_sold
        FROM orders o
        INNER JOIN order_items oi ON oi.order_id = o.id
        WHERE o.is_paid = true${orderFilters.clause}
      `,
      orderFilters.params
    );

    const reviewSummary = await this.getReviewSummary({
      from: query.from,
      to: query.to,
    });

    const newCustomersRows = await AppDataSource.query(
      `
        SELECT COUNT(*)::int AS new_customers
        FROM accounts a
        WHERE 1=1${accountFilters.clause}
      `,
      accountFilters.params
    );

    return {
      totalRevenue: this.toNumber(orderMetricsRows[0]?.total_revenue),
      totalOrders: this.toNumber(orderMetricsRows[0]?.total_orders),
      paidOrders: this.toNumber(orderMetricsRows[0]?.paid_orders),
      uniqueCustomers: this.toNumber(orderMetricsRows[0]?.unique_customers),
      totalItemsSold: this.toNumber(itemMetricsRows[0]?.total_items_sold),
      totalReviews: reviewSummary.totalReviews,
      averageRating: reviewSummary.averageRating,
      newCustomers: this.toNumber(newCustomersRows[0]?.new_customers),
    };
  }

  async getOrdersTrend(query: StatsRangeQueryDTO): Promise<StatsTrendDTO> {
    const groupBy = this.normalizeGroupBy(query.groupBy);
    const orderFilters = this.buildRangeClause('o.order_date', query.from, query.to);
    const periodExpression = this.getPeriodExpression('o.order_date', groupBy);

    const orderRows = (await AppDataSource.query(
      `
        SELECT
          ${periodExpression}::date AS period,
          COUNT(*)::int AS total_orders,
          COALESCE(SUM(CASE WHEN o.is_paid THEN 1 ELSE 0 END), 0)::int AS paid_orders,
          COALESCE(SUM(CASE WHEN o.is_paid THEN o.total_amount ELSE 0 END), 0) AS total_revenue
        FROM orders o
        WHERE 1=1${orderFilters.clause}
        GROUP BY ${periodExpression}::date
        ORDER BY period ASC
      `,
      orderFilters.params
    )) as Array<{
      period: string;
      total_orders: string;
      paid_orders: string;
      total_revenue: string;
    }>;

    const itemRows = (await AppDataSource.query(
      `
        SELECT
          ${periodExpression}::date AS period,
          COALESCE(SUM(oi.quantity), 0)::int AS total_items_sold
        FROM orders o
        INNER JOIN order_items oi ON oi.order_id = o.id
        WHERE o.is_paid = true${orderFilters.clause}
        GROUP BY ${periodExpression}::date
        ORDER BY period ASC
      `,
      orderFilters.params
    )) as Array<{
      period: string;
      total_items_sold: string;
    }>;

    const itemMap = new Map<string, number>();
    for (const row of itemRows) {
      itemMap.set(this.toPeriodKey(row.period), this.toNumber(row.total_items_sold));
    }

    const points: StatsTrendPointDTO[] = orderRows.map(
      (row: {
        period: string;
        total_orders: string;
        paid_orders: string;
        total_revenue: string;
      }) => {
        const period = this.toPeriodKey(row.period);

        return {
          period,
          totalOrders: this.toNumber(row.total_orders),
          paidOrders: this.toNumber(row.paid_orders),
          totalRevenue: this.toNumber(row.total_revenue),
          totalItemsSold: itemMap.get(period) ?? 0,
        };
      }
    );

    return {
      from: query.from ? new Date(query.from).toISOString() : null,
      to: query.to ? new Date(query.to).toISOString() : null,
      groupBy,
      points,
    };
  }

  async getOrdersStatusBreakdown(query: StatsRangeQueryDTO): Promise<StatsStatusBreakdownDTO> {
    const orderFilters = this.buildRangeClause('o.order_date', query.from, query.to);
    const rows = (await AppDataSource.query(
      `
        SELECT
          o.status AS status,
          COUNT(*)::int AS count
        FROM orders o
        WHERE 1=1${orderFilters.clause}
        GROUP BY o.status
      `,
      orderFilters.params
    )) as Array<{
      status: string;
      count: string;
    }>;

    const countsByStatus = new Map<string, number>();
    for (const row of rows) {
      countsByStatus.set(String(row.status), this.toNumber(row.count));
    }

    const items = [
      ORDER_STATUS_VALUE.PENDING,
      ORDER_STATUS_VALUE.CONFIRMED,
      ORDER_STATUS_VALUE.SHIPPING,
      ORDER_STATUS_VALUE.DELIVERED,
      ORDER_STATUS_VALUE.REVIEWED,
      ORDER_STATUS_VALUE.CANCELLED,
    ].map((status) => ({
      status,
      count: countsByStatus.get(status) ?? 0,
      percentage: 0,
    }));

    const totalOrders = items.reduce((sum, item) => sum + item.count, 0);

    return {
      totalOrders,
      items: items.map((item) => ({
        ...item,
        percentage: totalOrders > 0 ? Number(((item.count / totalOrders) * 100).toFixed(2)) : 0,
      })),
    };
  }

  async getTopSellingProducts(query: StatsRangeQueryDTO): Promise<TopSellingProductDTO[]> {
    const limit = this.normalizeLimit(query.limit);
    const orderFilters = this.buildRangeClause('o.order_date', query.from, query.to);

    const rows = (await AppDataSource.query(
      `
        SELECT
          v.product_id AS product_id,
          oi.variant_id AS variant_id,
          oi.product_name_snapshot AS product_name,
          oi.variant_name_snapshot AS variant_name,
          v.image_url AS image_url,
          COALESCE(SUM(oi.quantity), 0)::int AS quantity_sold,
          COALESCE(SUM(oi.total_amount), 0) AS revenue
        FROM order_items oi
        INNER JOIN orders o ON o.id = oi.order_id
        LEFT JOIN variants v ON v.id = oi.variant_id
        WHERE o.is_paid = true${orderFilters.clause}
        GROUP BY v.product_id, oi.variant_id, oi.product_name_snapshot, oi.variant_name_snapshot, v.image_url
        ORDER BY quantity_sold DESC, revenue DESC
        LIMIT ${limit}
      `,
      orderFilters.params
    )) as Array<{
      product_id: string;
      variant_id: string;
      product_name: string;
      variant_name: string;
      image_url: string | null;
      quantity_sold: string;
      revenue: string;
    }>;

    return rows.map((row) => ({
      productId: this.toNumber(row.product_id),
      productName: String(row.product_name ?? ''),
      variantId: this.toNumber(row.variant_id),
      variantName: String(row.variant_name ?? ''),
      imageUrl: row.image_url ? String(row.image_url) : null,
      quantitySold: this.toNumber(row.quantity_sold),
      revenue: this.toNumber(row.revenue),
    }));
  }

  async getTopSpenders(query: StatsRangeQueryDTO): Promise<TopSpenderDTO[]> {
    const limit = this.normalizeLimit(query.limit);
    const orderFilters = this.buildRangeClause('o.order_date', query.from, query.to);

    const rows = (await AppDataSource.query(
      `
        SELECT
          o.account_id AS account_id,
          a."phoneNum" AS phone_num,
          COUNT(*)::int AS total_orders,
          COALESCE(SUM(o.total_amount), 0) AS total_spent
        FROM orders o
        LEFT JOIN accounts a ON a.id = o.account_id
        WHERE o.is_paid = true${orderFilters.clause}
        GROUP BY o.account_id, a."phoneNum"
        ORDER BY total_spent DESC, total_orders DESC
        LIMIT ${limit}
      `,
      orderFilters.params
    )) as Array<{
      account_id: string;
      phone_num: string | null;
      total_orders: string;
      total_spent: string;
    }>;

    return rows.map((row) => ({
      accountId: this.toNumber(row.account_id),
      phoneNum: String(row.phone_num ?? ''),
      totalSpent: this.toNumber(row.total_spent),
      totalOrders: this.toNumber(row.total_orders),
    }));
  }

  async getReviewSummary(query: StatsRangeQueryDTO): Promise<RatingSummaryDTO> {
    const reviewFilters = this.buildReviewClause(query);

    const summaryRows = (await AppDataSource.query(
      `
        SELECT
          COALESCE(AVG(r.rating), 0) AS average_rating,
          COUNT(*)::int AS total_reviews
        FROM reviews r
        ${reviewFilters.clause}
      `,
      reviewFilters.params
    )) as Array<{
      average_rating: string;
      total_reviews: string;
    }>;

    const distributionRows = (await AppDataSource.query(
      `
        SELECT
          r.rating AS rating,
          COUNT(*)::int AS count
        FROM reviews r
        ${reviewFilters.clause}
        GROUP BY r.rating
      `,
      reviewFilters.params
    )) as Array<{
      rating: string;
      count: string;
    }>;

    const ratingDistribution = {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0,
    };

    for (const row of distributionRows) {
      const rating = String(row.rating) as keyof typeof ratingDistribution;

      if (rating in ratingDistribution) {
        ratingDistribution[rating] = this.toNumber(row.count);
      }
    }

    return {
      productId: query.productId ?? null,
      averageRating: Number(Number(summaryRows[0]?.average_rating ?? 0).toFixed(2)),
      totalReviews: this.toNumber(summaryRows[0]?.total_reviews),
      ratingDistribution,
    };
  }

  private buildReviewClause(query: Pick<StatsRangeQueryDTO, 'from' | 'to' | 'productId'>): {
    clause: string;
    params: unknown[];
  } {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (query.productId) {
      params.push(query.productId);
      conditions.push(`r.product_id = $${params.length}`);
    }

    if (query.from) {
      params.push(query.from);
      conditions.push(`r.created_at >= $${params.length}`);
    }

    if (query.to) {
      params.push(query.to);
      conditions.push(`r.created_at <= $${params.length}`);
    }

    return {
      clause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
      params,
    };
  }

  private buildRangeClause(
    columnName: string,
    from?: Date,
    to?: Date
  ): { clause: string; params: unknown[] } {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (from) {
      params.push(from);
      conditions.push(`${columnName} >= $${params.length}`);
    }

    if (to) {
      params.push(to);
      conditions.push(`${columnName} <= $${params.length}`);
    }

    return {
      clause: conditions.length ? ` AND ${conditions.join(' AND ')}` : '',
      params,
    };
  }

  private getPeriodExpression(columnName: string, groupBy: StatsGroupBy): string {
    switch (groupBy) {
      case 'week':
        return `date_trunc('week', ${columnName}::timestamp)`;
      case 'month':
        return `date_trunc('month', ${columnName}::timestamp)`;
      case 'day':
      default:
        return `date_trunc('day', ${columnName}::timestamp)`;
    }
  }

  private normalizeGroupBy(groupBy?: StatsGroupBy): StatsGroupBy {
    return groupBy ?? 'day';
  }

  private normalizeLimit(limit?: number): number {
    if (!limit || Number.isNaN(limit) || limit < 1) {
      return 10;
    }

    return Math.min(limit, 100);
  }

  private toPeriodKey(period: string | Date): string {
    return new Date(period).toISOString().slice(0, 10);
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
