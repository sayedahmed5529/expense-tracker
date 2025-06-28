import { Injectable } from '@angular/core';
import { Expense } from '../interfaces/expense';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
private expenses: Expense[] = [
  {
    id: 1,
    title: 'Groceries',
    amount: 50,
    currency: 'EGP',
    date: '2025-06-24',
    category: 'Food',
  },
  {
    id: 2,
    title: 'Electricity Bill',
    amount: 100,
    currency: 'EGP',
    date: '2025-06-20',
    category: 'Utilities',
  },
  {
    id: 3,
    title: 'Salary',
    amount: 5000,
    currency: 'EGP',
    date: '2025-06-01',
    category: 'Income',
    type: 'income'
  },
  {
    id: 4,
    title: 'Freelance Project',
    amount: 1500,
    currency: 'EGP',
    date: '2025-06-18',
    category: 'Income',
    type: 'income'
  },
  {
    id: 5,
    title: 'Internet Bill',
    amount: 75,
    currency: 'EGP',
    date: '2025-06-15',
    category: 'Utilities',
  },
  {
    id: 6,
    title: 'Restaurant',
    amount: 120,
    currency: 'EGP',
    date: '2025-06-10',
    category: 'Food',
  },
  {
    id: 7,
    title: 'Gym Membership',
    amount: 200,
    currency: 'EGP',
    date: '2025-06-01',
    category: 'Health',
  },
  {
    id: 8,
    title: 'Fuel',
    amount: 300,
    currency: 'EGP',
    date: '2025-05-30',
    category: 'Transport',
  },
  {
    id: 9,
    title: 'Books',
    amount: 250,
    currency: 'EGP',
    date: '2025-05-25',
    category: 'Education',
  },
  {
    id: 10,
    title: 'Gift',
    amount: 400,
    currency: 'EGP',
    date: '2025-05-20',
    category: 'Other',
  },
  {
    id: 11,
    title: 'Mobile Recharge',
    amount: 50,
    currency: 'EGP',
    date: '2025-05-18',
    category: 'Utilities',
  },
  {
    id: 12,
    title: 'Bonus',
    amount: 1000,
    currency: 'EGP',
    date: '2025-05-10',
    category: 'Income',
    type: 'income'
  },
  {
    id: 13,
    title: 'Movie Night',
    amount: 150,
    currency: 'EGP',
    date: '2025-05-10',
    category: 'Entertainment',
  },
  {
    id: 14,
    title: 'Online Course',
    amount: 500,
    currency: 'EGP',
    date: '2025-05-05',
    category: 'Education',
  },
  {
    id: 15,
    title: 'New Shoes',
    amount: 600,
    currency: 'EGP',
    date: '2025-05-01',
    category: 'Shopping',
  }
];


 
  constructor(private http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    // simulate API call
    return of(this.expenses).pipe(delay(500));
  }

  addExpense(expense: Expense): Observable<Expense> {
    const newExpense = { ...expense, id: Date.now() };
    this.expenses.unshift(newExpense);
    return of(newExpense).pipe(delay(300));
  }

  convertToUSD(amount: number, fromCurrency: string): Observable<number> {
    return this.http
      .get<any>(`https://open.er-api.com/v6/latest/${fromCurrency}`)
      .pipe(map((res: any) => amount * res.rates['USD']));
  }

}
