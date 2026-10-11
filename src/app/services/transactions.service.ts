import { Injectable, signal } from '@angular/core';

import { transactions as mockTransactions } from '../data/mock';
import type { Transaction } from '../models/transactions';

/**
 * Single source of truth for transactions, shared by every page.
 * Pages read `transactions()` and re-render automatically when it changes
 * (e.g. after a CSV upload on the dashboard).
 */
@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly _transactions = signal<Transaction[]>(mockTransactions);

  readonly transactions = this._transactions.asReadonly();

  /** Add transactions, skipping ones we already have (same date, amount and recipient). */
  addTransactions(newTransactions: Transaction[]): void {
    this._transactions.update((current) => {
      const seen = new Set(current.map((t) => this.key(t)));
      const unique = newTransactions.filter((t) => {
        const key = this.key(t);
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
      return [...current, ...unique];
    });
  }

  private key(t: Transaction): string {
    return `${t.date}-${t.amount}-${t.recipient}`;
  }
}
