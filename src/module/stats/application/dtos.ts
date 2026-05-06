import type { OrderStatus } from '@/module/order/domain/value_objects';
import type { StatsGroupBy } from '../domain/value_objects';

export interface StatsRangeQueryDTO {
  from?: Date;
  to?: Date;
  groupBy?: StatsGroupBy;
  limit?: number;
  productId?: number;
}

export interface StatsOverviewDTO {
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
  uniqueCustomers: number;
  totalItemsSold: number;
  totalReviews: number;
  averageRating: number;
  newCustomers: number;
}

export interface StatsTrendPointDTO {
  period: string;
  totalOrders: number;
  paidOrders: number;
  totalRevenue: number;
  totalItemsSold: number;
}

export interface StatsTrendDTO {
  from: string | null;
  to: string | null;
  groupBy: StatsGroupBy;
  points: StatsTrendPointDTO[];
}

export interface StatsStatusBreakdownItemDTO {
  status: OrderStatus;
  count: number;
  percentage: number;
}

export interface StatsStatusBreakdownDTO {
  totalOrders: number;
  items: StatsStatusBreakdownItemDTO[];
}

export interface StatsRevenueByStatusItemDTO {
  status: OrderStatus;
  count: number;
  percentage: number;
  totalAmount: number;
  paidAmount: number;
}

export interface StatsRevenueByStatusDTO {
  totalOrders: number;
  totalAmount: number;
  items: StatsRevenueByStatusItemDTO[];
}

export interface TopSellingProductDTO {
  productId: number;
  productName: string;
  variantId: number;
  variantName: string;
  imageUrl: string | null;
  quantitySold: number;
  revenue: number;
}

export interface TopSpenderDTO {
  accountId: number;
  phoneNum: string;
  totalSpent: number;
  totalOrders: number;
}

export interface RatingDistributionDTO {
  '5': number;
  '4': number;
  '3': number;
  '2': number;
  '1': number;
}

export interface RatingSummaryDTO {
  productId: number | null;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistributionDTO;
}
