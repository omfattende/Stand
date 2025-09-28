import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
  avatar?: string;
  department?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  // Base de datos de usuarios permitidos
  private allowedUsers = [
    { email: 'admin@stand.com', password: '123456', role: 'admin', name: 'Administrador Principal' },
    { email: 'admin2@stand.com', password: '123456', role: 'admin', name: 'Administrador Secundario' },
    { email: 'sales@stand.com', password: '123456', role: 'sales', name: 'Equipo de Ventas' },
    { email: 'ventas@stand.com', password: '123456', role: 'sales', name: 'Departamento de Ventas' },
    { email: 'sales1@stand.com', password: '123456', role: 'sales', name: 'Vendedor 1' },
    { email: 'sales2@stand.com', password: '123456', role: 'sales', name: 'Vendedor 2' }
  ];

  constructor() {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedAuth === 'true' && savedUser) {
      try {
        const user: User = JSON.parse(savedUser);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return of(null).pipe(
      delay(1000), // Simular delay de red
      map(() => {
        // Buscar usuario en la lista de permitidos
        const allowedUser = this.allowedUsers.find(user => 
          user.email === email && user.password === password
        );

        if (allowedUser) {
          const user: User = {
            id: Date.now(),
            email: allowedUser.email,
            name: allowedUser.name,
            roles: [allowedUser.role],
            avatar: allowedUser.role === 'admin' ? '👨‍💼' : '💼',
            department: allowedUser.role === 'admin' ? 'Administración' : 'Ventas'
          };
          this.setAuthData(user);
          return true;
        }
        return false;
      })
    );
  }

  private setAuthData(user: User): void {
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(user);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): void {
    this.clearAuthData();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  private clearAuthData(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isSales(): boolean {
    return this.hasRole('sales');
  }

  // Método para agregar nuevos usuarios si es necesario
  addUser(email: string, password: string, role: 'admin' | 'sales', name: string): void {
    this.allowedUsers.push({ email, password, role, name });
  }

  // Obtener lista de usuarios permitidos (solo para admin)
  getAllowedUsers(): any[] {
    return this.allowedUsers.map(user => ({ 
      email: user.email, 
      role: user.role, 
      name: user.name 
    }));
  }
}