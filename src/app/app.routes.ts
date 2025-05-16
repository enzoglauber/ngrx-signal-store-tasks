import { Routes } from '@angular/router';
import { BasicLayoutComponent } from './core/layouts/basic-layout/basic-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: 'auth',
    component: BasicLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
    ],
  },
  {
    path: 'tasks',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/tasks/task-list/task-list.component').then(
            (m) => m.TaskListComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/tasks/task-detail/task-detail.component').then(
            (m) => m.TaskDetailComponent
          ),
      },
    ],
  },
  // {
  //   path: 'auth',
  //   loadComponent: () =>
  //     import('./core/pages/auth/auth.component').then((m) => m.AuthComponent),
  // },
  // {
  //   path: '',
  //   component: MainLayoutComponent,
  //   canActivate: [authGuard],
  //   children: [
  //     {
  //       path: 'dashboard',
  //       loadComponent: () =>
  //         import('./feature/dashboard/dashboard.component').then(
  //           (m) => m.DashboardComponent
  //         ),
  //     },
  //     {
  //       path: 'accounts',
  //       children: [
  //         {
  //           path: '',
  //           loadComponent: () =>
  //             import(
  //               './feature/accounts/account-list/account-list.component'
  //             ).then((m) => m.AccountListComponent),
  //         },
  //         {
  //           path: 'new',
  //           loadComponent: () =>
  //             import(
  //               './feature/accounts/account-form/account-form.component'
  //             ).then((m) => m.AccountFormComponent),
  //         },
  //         {
  //           path: 'edit/:id',
  //           loadComponent: () =>
  //             import(
  //               './feature/accounts/account-form/account-form.component'
  //             ).then((m) => m.AccountFormComponent),
  //         },
  //         {
  //           path: ':id',
  //           loadComponent: () =>
  //             import(
  //               './feature/accounts/account-detail/account-detail.component'
  //             ).then((m) => m.AccountDetailComponent),
  //         },
  //       ],
  //     },
  //     {
  //       path: 'transfers',
  //       children: [
  //         {
  //           path: 'new',
  //           loadComponent: () =>
  //             import(
  //               './feature/transfers/transfer-form/transfer-form.component'
  //             ).then((m) => m.TransferFormComponent),
  //         },
  //       ],
  //     },
  //     {
  //       path: 'transactions',
  //       children: [
  //         {
  //           path: '',
  //           loadComponent: () =>
  //             import(
  //               './feature/transactions/transaction-list/transaction-list.component'
  //             ).then((m) => m.TransactionListComponent),
  //         },
  //         {
  //           path: ':id',
  //           loadComponent: () =>
  //             import(
  //               './feature/transactions/transaction-detail/transaction-detail.component'
  //             ).then((m) => m.TransactionDetailComponent),
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./core/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  { path: '**', redirectTo: 'not-found' },
];
