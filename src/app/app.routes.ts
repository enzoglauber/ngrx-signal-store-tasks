import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { taskRoutes } from './features/tasks/task.routes';

const features = [...authRoutes, ...taskRoutes];

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  ...features,
  {
    path: 'not-found',
    loadComponent: () =>
      import('./core/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  { path: '**', redirectTo: 'not-found' },
];
