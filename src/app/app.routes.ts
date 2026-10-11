import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'analytics', loadComponent: () => import('./pages/analytics/analytics').then(m => m.Analytics) },
  { path: 'recurring-calendar', loadComponent: () => import('./pages/recurring-calendar/recurring-calendar').then(m => m.RecurringCalendar) },
  { path: 'users', loadComponent: () => import('./pages/users/users').then(m => m.Users) },
  { path: 'settings', loadComponent: () => import('./pages/settings/settings').then(m => m.Settings) }
];