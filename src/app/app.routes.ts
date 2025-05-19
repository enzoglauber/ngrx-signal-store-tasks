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
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./features/tasks/task-form/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
    ],
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./core/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  { path: '**', redirectTo: 'not-found' },
];
