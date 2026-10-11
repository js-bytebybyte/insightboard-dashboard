import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

import { TransactionsService } from '../../services/transactions.service';
import type { ScheduledPayment } from '../../models/recurring-expense';
import {
  daysInMonth,
  detectRecurringExpenses,
  getPaymentsForMonth,
} from '../../utils/recurring-expenses';

interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  payments: ScheduledPayment[];
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CATEGORY_CLASSES: Record<string, string> = {
  Rent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Utilities: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Subscriptions: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  Healthcare: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  Pension: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  Transport: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
};
const DEFAULT_CATEGORY_CLASS =
  'bg-blue-gray-100 text-blue-gray-800 dark:bg-blue-gray-700 dark:text-blue-gray-200';

@Component({
  selector: 'app-recurring-calendar',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './recurring-calendar.html',
  styleUrl: './recurring-calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecurringCalendar {
  private readonly transactionsService = inject(TransactionsService);

  protected readonly weekdays = WEEKDAYS;

  /** First day of the month that is shown. */
  protected readonly visibleMonth = signal(this.startOfMonth(new Date()));

  protected readonly recurringExpenses = computed(() =>
    detectRecurringExpenses(this.transactionsService.transactions()),
  );

  protected readonly paymentsThisMonth = computed(() => {
    const month = this.visibleMonth();
    return getPaymentsForMonth(this.recurringExpenses(), month.getFullYear(), month.getMonth());
  });

  protected readonly monthTotal = computed(() =>
    this.paymentsThisMonth().reduce((sum, p) => sum + p.expense.amount, 0),
  );

  /** Full weeks (Monday to Sunday) covering the visible month, padded with the days around it. */
  protected readonly calendarDays = computed<CalendarDay[]>(() => {
    const month = this.visibleMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const today = new Date().toDateString();

    // getDay() is 0 for Sunday; shift so Monday is the first column.
    const leadingDays = (month.getDay() + 6) % 7;
    const totalCells = Math.ceil((leadingDays + daysInMonth(year, monthIndex)) / 7) * 7;

    const paymentsByDay = new Map<number, ScheduledPayment[]>();
    for (const payment of this.paymentsThisMonth()) {
      const day = payment.date.getDate();
      paymentsByDay.set(day, [...(paymentsByDay.get(day) ?? []), payment]);
    }

    return Array.from({ length: totalCells }, (_, i) => {
      const date = new Date(year, monthIndex, i - leadingDays + 1);
      const inCurrentMonth = date.getMonth() === monthIndex;
      return {
        date,
        inCurrentMonth,
        isToday: date.toDateString() === today,
        payments: inCurrentMonth ? (paymentsByDay.get(date.getDate()) ?? []) : [],
      };
    });
  });

  protected previousMonth(): void {
    this.visibleMonth.update((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }

  protected nextMonth(): void {
    this.visibleMonth.update((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  protected goToToday(): void {
    this.visibleMonth.set(this.startOfMonth(new Date()));
  }

  protected dayCellClass(day: CalendarDay): string {
    return day.inCurrentMonth
      ? 'bg-white dark:bg-blue-gray-800'
      : 'bg-blue-gray-50 dark:bg-blue-gray-900/40';
  }

  protected dayNumberClass(day: CalendarDay): string {
    if (day.isToday) {
      return 'bg-purple-600 text-white';
    }
    return day.inCurrentMonth
      ? 'text-blue-gray-700 dark:text-blue-gray-200'
      : 'text-blue-gray-300 dark:text-blue-gray-600';
  }

  protected categoryClass(category: string): string {
    return CATEGORY_CLASSES[category] ?? DEFAULT_CATEGORY_CLASS;
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
}
