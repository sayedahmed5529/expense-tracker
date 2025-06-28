export interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
   type?: 'income' | 'expense';
  currency: string;
  convertedAmount?: number;
}