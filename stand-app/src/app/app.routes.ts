import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: "sales",
    loadComponent: () => import('./usuarios/usuarios.component').then(m => m.UsuariosComponent)
  },
  
  {
    path: '**',
    redirectTo: '/login'
  }
];
