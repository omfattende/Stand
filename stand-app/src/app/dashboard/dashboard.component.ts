import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService,User } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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

  // Métodos útiles para el template
  getUserName(): string {
    return this.currentUser?.name || 'Usuario';
  }

  getUserEmail(): string {
    return this.currentUser?.email || '';
  }

  getUserRole(): string {
    return this.currentUser?.roles[0] || 'user';
  }

  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

}
