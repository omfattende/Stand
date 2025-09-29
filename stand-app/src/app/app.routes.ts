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
  // Redirect usuarios-related paths to home
  { path: 'sales', redirectTo: '/home', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: '/home', pathMatch: 'full' },
  // New public routes
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'collection',
    loadComponent: () => import('./pages/collection/collection.component').then(m => m.CollectionComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'web-tv',
    loadComponent: () => import('./pages/web-tv/web-tv.component').then(m => m.WebTvComponent)
  },
  {
    path: 'mapa',
    loadComponent: () => import('./pages/mapa/mapa.component').then(m => m.MapaComponent)
  },
  {
    path: 'galeria',
    loadComponent: () => import('./pages/galeria/galeria.component').then(m => m.GaleriaComponent)
  },
  
  {
    path: '**',
    redirectTo: '/login'
  }
];
