import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'expenses', loadComponent: () => import('./pages/expenses/expenses').then(m => m.Expenses) },
  { path: 'analytics', loadComponent: () => import('./pages/analytics/analytics').then(m => m.Analytics) },
  { path: 'users', loadComponent: () => import('./pages/users/users').then(m => m.Users) },
  { path: 'settings', loadComponent: () => import('./pages/settings/settings').then(m => m.Settings) }
];