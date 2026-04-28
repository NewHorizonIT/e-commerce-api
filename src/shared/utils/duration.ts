type DurationUnit = 's' | 'm' | 'h' | 'd';

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

const UNIT_IN_SECONDS: Record<DurationUnit, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
};

function parseDuration(value: string): { amount: number; unit: DurationUnit } | null {
  const match = value.trim().match(/^(\d+)([smhd])$/i);

  if (!match) {
    return null;
  }

  return {
    amount: Number(match[1]),
    unit: match[2].toLowerCase() as DurationUnit,
  };
}

export function parseDurationToSeconds(value: string, fallbackDays = 7): number {
  const parsed = parseDuration(value);

  if (!parsed) {
    return fallbackDays * UNIT_IN_SECONDS.d;
  }

  return parsed.amount * UNIT_IN_SECONDS[parsed.unit];
}

export function parseDurationToMilliseconds(value: string, fallbackDays = 7): number {
  return parseDurationToSeconds(value, fallbackDays) * SECOND_IN_MS;
}

export const DURATION_CONSTANTS = {
  SECOND_IN_MS,
  MINUTE_IN_MS,
  HOUR_IN_MS,
  DAY_IN_MS,
} as const;
