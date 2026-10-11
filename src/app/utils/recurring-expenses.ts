import type { Transaction } from '../models/transactions';
import type {
  RecurrenceFrequency,
  RecurringExpense,
  ScheduledPayment,
} from '../models/recurring-expense';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** How many months lie between two payments for each frequency. */
export const FREQUENCY_MONTHS: Record<RecurrenceFrequency, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

/**
 * Accepted gap (in days) between two payments for each frequency.
 * Banks book a few days early or late (weekends, holidays), so the ranges are generous.
 */
const FREQUENCY_DAY_RANGES: { frequency: RecurrenceFrequency; min: number; max: number }[] = [
  { frequency: 'monthly', min: 25, max: 35 },
  { frequency: 'quarterly', min: 80, max: 100 },
  { frequency: 'yearly', min: 340, max: 390 },
];

/**
 * Parse the date formats we get: `DD/MM/YYYY` (KBC export) or ISO `YYYY-MM-DD`.
 * Returns null for anything else instead of guessing.
 */
export function parseTransactionDate(value: string): Date | null {
  const belgian = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (belgian) {
    const [, day, month, year] = belgian;
    return createValidDate(Number(year), Number(month) - 1, Number(day));
  }

  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (iso) {
    const [, year, month, day] = iso;
    return createValidDate(Number(year), Number(month) - 1, Number(day));
  }

  return null;
}

/** `new Date(2026, 1, 31)` silently becomes 3 March, so reject dates that roll over. */
function createValidDate(year: number, monthIndex: number, day: number): Date | null {
  const date = new Date(year, monthIndex, day);
  return date.getMonth() === monthIndex && date.getDate() === day ? date : null;
}

export function daysInMonth(year: number, monthIndex: number): number {
  // Day 0 of the next month is the last day of this month.
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Whole calendar months from `from` to `to` (can be negative). */
function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

/** Most frequent day of the month; on a tie, the most recent payment's day wins. */
function typicalDayOfMonth(sortedDates: Date[]): number {
  const counts = new Map<number, number>();
  for (const date of sortedDates) {
    counts.set(date.getDate(), (counts.get(date.getDate()) ?? 0) + 1);
  }

  let bestDay = sortedDates[sortedDates.length - 1].getDate();
  let bestCount = counts.get(bestDay) ?? 0;
  for (const [day, count] of counts) {
    if (count > bestCount) {
      bestDay = day;
      bestCount = count;
    }
  }
  return bestDay;
}

function classifyInterval(days: number): RecurrenceFrequency | null {
  return FREQUENCY_DAY_RANGES.find((r) => days >= r.min && days <= r.max)?.frequency ?? null;
}

/**
 * Find payments that repeat on a regular schedule.
 *
 * 1. Group transactions by recipient.
 * 2. Keep recipients paid at least twice.
 * 3. Look at the median gap between payments and match it to monthly / quarterly / yearly.
 *    The median ignores one odd gap (e.g. a missed or doubled payment).
 */
export function detectRecurringExpenses(transactions: Transaction[]): RecurringExpense[] {
  const byRecipient = new Map<string, { transaction: Transaction; date: Date }[]>();

  for (const transaction of transactions) {
    const recipient = transaction.recipient.trim();
    const date = parseTransactionDate(transaction.date);
    if (!date || !recipient || recipient === 'Unknown') {
      continue;
    }
    const key = recipient.toLowerCase();
    byRecipient.set(key, [...(byRecipient.get(key) ?? []), { transaction, date }]);
  }

  const result: RecurringExpense[] = [];

  for (const payments of byRecipient.values()) {
    if (payments.length < 2) {
      continue;
    }

    payments.sort((a, b) => a.date.getTime() - b.date.getTime());
    const dates = payments.map((p) => p.date);

    const gaps = dates.slice(1).map((date, i) => (date.getTime() - dates[i].getTime()) / MS_PER_DAY);
    const frequency = classifyInterval(median(gaps));
    if (!frequency) {
      continue;
    }

    const total = payments.reduce((sum, p) => sum + p.transaction.amount, 0);
    const latest = payments[payments.length - 1].transaction;

    result.push({
      recipient: latest.recipient.trim(),
      category: latest.category,
      frequency,
      amount: Math.round((total / payments.length) * 100) / 100,
      dayOfMonth: typicalDayOfMonth(dates),
      firstPaymentDate: dates[0],
      lastPaymentDate: dates[dates.length - 1],
      occurrences: payments.length,
    });
  }

  return result.sort((a, b) => a.dayOfMonth - b.dayOfMonth || a.recipient.localeCompare(b.recipient));
}

/**
 * Project the recurring expenses onto one calendar month.
 * A payment on the 31st lands on the last day in shorter months (e.g. 28 February).
 */
export function getPaymentsForMonth(
  expenses: RecurringExpense[],
  year: number,
  monthIndex: number,
): ScheduledPayment[] {
  const monthStart = new Date(year, monthIndex, 1);
  const lastDay = daysInMonth(year, monthIndex);

  return expenses
    .filter((expense) => {
      if (monthsBetween(expense.firstPaymentDate, monthStart) < 0) {
        return false;
      }
      const interval = FREQUENCY_MONTHS[expense.frequency];
      const offset = monthsBetween(expense.lastPaymentDate, monthStart);
      // `%` keeps the sign in JavaScript (-1 % 3 === -1), so normalise to 0..interval-1.
      return ((offset % interval) + interval) % interval === 0;
    })
    .map((expense) => ({
      date: new Date(year, monthIndex, Math.min(expense.dayOfMonth, lastDay)),
      expense,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
