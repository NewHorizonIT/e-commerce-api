export const STATS_GROUP_BY_VALUE = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
} as const;

export type StatsGroupBy = (typeof STATS_GROUP_BY_VALUE)[keyof typeof STATS_GROUP_BY_VALUE];
