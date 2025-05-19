import { BasicLayoutComponent } from '@/app/core/layouts/basic-layout/basic-layout.component';
import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'auth',
    component: BasicLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component').then((m) => m.LoginComponent),
      },
    ],
  },
];
