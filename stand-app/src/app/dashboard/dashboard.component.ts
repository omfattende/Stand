import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService,User } from '../auth.service';
import { ProductChartComponent } from '../components/product-chart/product-chart.component';
import { SalesStatsComponent } from '../components/sales-stats/sales-stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProductChartComponent, SalesStatsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null; // Cambia string por User | null

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Eliminar la cuenta del usuario actual
  deleteMyAccount(): void {
    const email = this.getCurrentEmail();
    if (!email) return;
    
    // Evitar que el admin elimine su propia cuenta
    if (this.isAdmin()) return;
    
    const ok = confirm(`¿Seguro que deseas eliminar tu cuenta (${email})? Esta acción no se puede deshacer.`);
    if (!ok) return;
    const removed = this.authService.deleteCurrentUser();
    if (removed) {
      // Si se eliminó a sí mismo, el servicio cierra la sesión
      this.router.navigate(['/login']);
    }
  }

  // Datos para métricas
  getUsersCount(): number {
    return this.authService.getAllowedUsersCount();
  }

  // Solo para vistas de admin: obtener usuarios permitidos
  getAllowedUsers(): { email: string; role: string; name: string }[] {
    return this.authService.getAllowedUsers();
  }

  getCurrentEmail(): string {
    return this.currentUser?.email || '';
  }

  // DEMO: Muestra contraseña desde lista local (no usar en producción)
  getCurrentPassword(): string {
    const email = this.getCurrentEmail();
    return email ? (this.authService.getPasswordForEmail(email) || 'N/D') : 'N/D';
  }

  // Métodos útiles para el encabezado
  getUserName(): string {
    return this.currentUser?.name || 'Usuario';
  }

  getUserRole(): string {
    return this.currentUser?.roles[0] || 'user';
  }

  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  // Accion de admin para eliminar cualquier usuario por email
  deleteUser(email: string): void {
    const currentEmail = this.getCurrentEmail();
    
    // Evitar que el admin se elimine a sí mismo
    if (email === currentEmail && this.isAdmin()) return;
    
    const ok = confirm(`¿Eliminar la cuenta ${email}?`);
    if (!ok) return;
    const removed = this.authService.deleteUserByEmail(email);
    if (removed) {
      // Refrescar estado de usuario actual en memoria
      this.currentUser = this.authService.getCurrentUser();
    }
  }

}
