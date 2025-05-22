import { MainLayoutComponent } from '@/app/core/layouts/main-layout/main-layout.component';
import { Routes } from '@angular/router';

export const taskRoutes: Routes = [
  {
    path: 'tasks',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./task-list/task-list.component').then(
            (m) => m.TaskListComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./task-form/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./task-detail/task-detail.component').then(
            (m) => m.TaskDetailComponent
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./task-form/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
    ],
  },
];
