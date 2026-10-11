import type { Transaction } from '../models/transactions';
import {
  detectRecurringExpenses,
  getPaymentsForMonth,
  parseTransactionDate,
} from './recurring-expenses';

function tx(recipient: string, date: string, amount: number, category = 'Other'): Transaction {
  return { id: `${recipient}-${date}`, recipient, category, notes: '', date, amount, status: 'Completed' };
}

describe('parseTransactionDate', () => {
  it('parses the KBC DD/MM/YYYY format', () => {
    expect(parseTransactionDate('05/03/2026')).toEqual(new Date(2026, 2, 5));
  });

  it('parses ISO dates', () => {
    expect(parseTransactionDate('2026-03-05')).toEqual(new Date(2026, 2, 5));
  });

  it('rejects impossible dates and unknown formats', () => {
    expect(parseTransactionDate('31/02/2026')).toBeNull();
    expect(parseTransactionDate('March 5th')).toBeNull();
  });
});

describe('detectRecurringExpenses', () => {
  it('detects a monthly payment and averages the amount', () => {
    const [rent] = detectRecurringExpenses([
      tx('Landlord', '01/07/2026', 900, 'Rent'),
      tx('Landlord', '01/08/2026', 950, 'Rent'),
      tx('Landlord', '01/09/2026', 1000, 'Rent'),
    ]);

    expect(rent.frequency).toBe('monthly');
    expect(rent.amount).toBe(950);
    expect(rent.dayOfMonth).toBe(1);
    expect(rent.category).toBe('Rent');
  });

  it('detects quarterly and yearly payments', () => {
    const result = detectRecurringExpenses([
      tx('Animo', '05/04/2026', 45),
      tx('Animo', '05/07/2026', 45),
      tx('Pricos', '20/12/2024', 1000),
      tx('Pricos', '20/12/2025', 1000),
    ]);

    expect(result.find((e) => e.recipient === 'Animo')?.frequency).toBe('quarterly');
    expect(result.find((e) => e.recipient === 'Pricos')?.frequency).toBe('yearly');
  });

  it('groups recipients case-insensitively', () => {
    const result = detectRecurringExpenses([
      tx('NETFLIX', '15/07/2026', 13.99),
      tx('Netflix ', '15/08/2026', 13.99),
    ]);

    expect(result.length).toBe(1);
  });

  it('ignores one-off, irregular and unknown-recipient payments', () => {
    const result = detectRecurringExpenses([
      tx('Delhaize', '03/09/2026', 54.3),
      tx('Bakery', '01/09/2026', 5),
      tx('Bakery', '08/09/2026', 5),
      tx('Unknown', '01/07/2026', 10),
      tx('Unknown', '01/08/2026', 10),
    ]);

    expect(result).toEqual([]);
  });
});

describe('getPaymentsForMonth', () => {
  const expenses = detectRecurringExpenses([
    tx('Netflix', '31/07/2026', 13.99),
    tx('Netflix', '31/08/2026', 13.99),
    tx('Animo', '05/04/2026', 45),
    tx('Animo', '05/07/2026', 45),
  ]);

  it('moves a payment on the 31st to the last day of shorter months', () => {
    const payments = getPaymentsForMonth(expenses, 2026, 10); // November
    const netflix = payments.find((p) => p.expense.recipient === 'Netflix');

    expect(netflix?.date).toEqual(new Date(2026, 10, 30));
  });

  it('only shows quarterly payments every third month', () => {
    const hasAnimo = (monthIndex: number) =>
      getPaymentsForMonth(expenses, 2026, monthIndex).some((p) => p.expense.recipient === 'Animo');

    expect(hasAnimo(9)).toBeTrue(); // October
    expect(hasAnimo(10)).toBeFalse(); // November
    expect(hasAnimo(0)).toBeFalse(); // January 2026 is before the first payment
  });
});
