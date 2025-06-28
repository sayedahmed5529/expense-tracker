import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';

import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { Expense } from '../interfaces/expense';
import { ExpenseFilterType } from '../enums/expense-filter-type';
import { ExpenseService } from '../services/expense.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  expenses = signal<Expense[]>([]);
   ITEMS_PER_PAGE = 9;
  pageSize = signal(this.ITEMS_PER_PAGE);


  // Filters
  selectedFilter = signal<ExpenseFilterType>(ExpenseFilterType.All);
  isLoading = false;
  ngUnsubscribe: Subject<void> = new Subject<void>();
  filters = Object.values(ExpenseFilterType);

  constructor(private expenseService: ExpenseService, private router: Router,private authService: AuthService) { }

  ngOnInit() {
    this.getexpenses();
  }
  getexpenses() {
    this.isLoading = true;

    this.expenseService.getExpenses().
      pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.isLoading = false)
      )
      .subscribe((data) => {
        this.expenses.set(data);
      });
  }
  onFilterChange(filter: ExpenseFilterType) {
    this.selectedFilter.set(filter);
    this.pageSize.set(this.ITEMS_PER_PAGE);
  }

  filteredExpenses = computed(() => {
    const all = this.expenses();
    const filter = this.selectedFilter();
    const today = new Date();
    return all.filter(exp => {
      const d = new Date(exp.date);
      if (filter === ExpenseFilterType.ThisMonth) {
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      }
      if (filter === ExpenseFilterType.Last7Days) {
        const ago = new Date(today);
        ago.setDate(today.getDate() - 7);
        return d >= ago && d <= today;
      }
      return true;
    });
  });
  paginatedExpenses = computed(() => {
    return this.filteredExpenses().slice(0, this.pageSize());
  });
  loadMore() {
    this.pageSize.update(size => size + 9);
  }
  totalIncome = computed(() =>
    this.filteredExpenses()
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0)
  );

  totalExpenses = computed(() =>
    this.filteredExpenses()
      .filter(e => e.type !== 'income')
      .reduce((sum, e) => sum + e.amount, 0)
  );

  totalBalance = computed(() =>
    this.totalIncome() - this.totalExpenses()
  );

  goToAddExpense() {
    this.router.navigate(['/add-expense']);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  logout() {
    this.authService.logout();
  }
}
