import type { Transaction } from '../models/transactions';

// Made-up transactions so the app builds and shows something on a fresh clone.
// Real bank data belongs in src/app/data/ (git-ignored) or comes in via "Upload CSV".
export const sampleTransactions: Transaction[] = [
  { id: 's1', recipient: 'Landlord', category: 'Rent', notes: 'Monthly rent', date: '01/03/2026', amount: 850, status: 'Completed' },
  { id: 's2', recipient: 'Energy Co', category: 'Utilities', notes: 'Gas & electricity', date: '03/03/2026', amount: 95.4, status: 'Completed' },
  { id: 's3', recipient: 'Water Co', category: 'Utilities', notes: 'Water', date: '05/03/2026', amount: 28.1, status: 'Completed' },
  { id: 's4', recipient: 'Netflix', category: 'Subscriptions', notes: '', date: '06/03/2026', amount: 13.99, status: 'Completed' },
  { id: 's5', recipient: 'Spotify', category: 'Subscriptions', notes: '', date: '07/03/2026', amount: 10.99, status: 'Completed' },
  { id: 's6', recipient: 'Delhaize', category: 'Groceries', notes: '', date: '08/03/2026', amount: 64.3, status: 'Completed' },
  { id: 's7', recipient: 'Aldi', category: 'Groceries', notes: '', date: '15/03/2026', amount: 41.75, status: 'Completed' },
  { id: 's8', recipient: 'Pizza Place', category: 'Dining', notes: '', date: '16/03/2026', amount: 22.5, status: 'Completed' },
  { id: 's9', recipient: 'Health Insurer', category: 'Healthcare', notes: 'Monthly premium', date: '20/03/2026', amount: 12.0, status: 'Completed' },
  { id: 's10', recipient: 'Train Company', category: 'Transport', notes: 'Monthly pass', date: '25/03/2026', amount: 49.0, status: 'Completed' },
];
