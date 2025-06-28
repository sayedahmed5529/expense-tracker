import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './auth/auth.routes';
import { authGuard } from './auth/guards/auth.guard';
import { AddExpenseComponent } from './features/components/add-expense/add-expense.component';

export const routes: Routes = [
  ...AUTH_ROUTES,
  {
    path: 'dashboard',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
 {
    path: 'add-expense',
    component: AddExpenseComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
