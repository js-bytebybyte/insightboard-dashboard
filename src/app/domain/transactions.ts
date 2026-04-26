export interface Transaction {
  id: string;
  recipient: string;
  category: string;
  notes: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}