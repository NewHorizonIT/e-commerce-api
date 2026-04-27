export const DISCOUNT_TYPE_VALUE = {
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
} as const;

export type DiscountType = (typeof DISCOUNT_TYPE_VALUE)[keyof typeof DISCOUNT_TYPE_VALUE];
