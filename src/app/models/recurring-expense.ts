export type RecurrenceFrequency = 'monthly' | 'quarterly' | 'yearly';

/** A payment that was detected to repeat on a regular schedule. */
export interface RecurringExpense {
  recipient: string;
  category: string;
  frequency: RecurrenceFrequency;
  /** Expected amount: the average of all past payments. */
  amount: number;
  /** Day of the month the payment usually happens (1-31). */
  dayOfMonth: number;
  /** First payment we know of; nothing is projected before this month. */
  firstPaymentDate: Date;
  /** Most recent payment; used to work out which months a quarterly/yearly payment falls in. */
  lastPaymentDate: Date;
  occurrences: number;
}

/** One expected payment on a specific calendar day. */
export interface ScheduledPayment {
  date: Date;
  expense: RecurringExpense;
}
