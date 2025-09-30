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

  // Base de datos de usuarios permitidos (solo admin)
  private allowedUsers = [
    { email: 'admin@stand.com', password: '123456', role: 'admin', name: 'Administrador' }
  ];

  // Cuenta cliente predeterminada
  private defaultClient = { email: 'cliente@stand.com', password: '123456', role: 'client', name: 'Cliente Demo' };

  // Usuarios registrados públicamente (clientes)
  private registeredUsers: Array<{ email: string; password: string; role: string; name: string }> = [];


  constructor() {
    this.loadRegisteredUsers();
    this.checkStoredAuth();
  }

  private loadRegisteredUsers(): void {
    const saved = localStorage.getItem('registeredUsers');
    if (saved) {
      try {
        this.registeredUsers = JSON.parse(saved);
      } catch {
        this.registeredUsers = [];
      }
    }
  }

  private saveRegisteredUsers(): void {
    localStorage.setItem('registeredUsers', JSON.stringify(this.registeredUsers));
  }

  private checkStoredAuth(): void {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('currentUser');
    if (savedAuth === 'true' && savedUser) {
      try {
        const user: User = JSON.parse(savedUser);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(user);
      } catch {
        this.clearAuthData();
      }
    }
  }

  // Registro público de clientes
  register(email: string, password: string, name: string): Observable<{ success: boolean; message: string }> {
    return of(null).pipe(
      delay(500),
      map(() => {
        // Verificar si el email ya existe en allowedUsers o registeredUsers
        const existsInAllowed = this.allowedUsers.find(u => u.email === email);
        const existsInRegistered = this.registeredUsers.find(u => u.email === email);
        
        if (existsInAllowed || existsInRegistered) {
          return { success: false, message: 'Este email ya está registrado' };
        }

        // Registrar nuevo usuario como cliente
        this.registeredUsers.push({
          email,
          password,
          role: 'client',
          name
        });
        
        this.saveRegisteredUsers();
        return { success: true, message: 'Registro exitoso' };
      })
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        // Buscar primero en allowedUsers (admin)
        let foundUser = this.allowedUsers.find(u => u.email === email && u.password === password);
        
        // Si no se encuentra, buscar en cliente predeterminado
        if (!foundUser && this.defaultClient.email === email && this.defaultClient.password === password) {
          foundUser = this.defaultClient;
        }
        
        // Si no se encuentra, buscar en registeredUsers (clientes)
        if (!foundUser) {
          foundUser = this.registeredUsers.find(u => u.email === email && u.password === password);
        }

        if (foundUser) {
          const user: User = {
            id: Date.now(),
            email: foundUser.email,
            name: foundUser.name,
            roles: [foundUser.role],
            avatar: foundUser.role === 'admin' ? '👨‍💼' : '👤',
            department: foundUser.role === 'admin' ? 'Administración' : 'Cliente'
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

  // Eliminar la cuenta del usuario actualmente autenticado
  deleteCurrentUser(): boolean {
    const current = this.currentUserSubject.value;
    if (!current) return false;
    const removed = this.deleteUserByEmail(current.email);
    return removed;
  }

  // Eliminar un usuario de la lista permitida por email
  deleteUserByEmail(email: string): boolean {
    const current = this.currentUserSubject.value;
    const deletingSelf = current?.email === email;
    
    // Buscar en allowedUsers
    const idxAllowed = this.allowedUsers.findIndex(u => u.email === email);
    if (idxAllowed !== -1) {
      this.allowedUsers.splice(idxAllowed, 1);
      if (deletingSelf) {
        this.logout();
      }
      return true;
    }
    
    // Buscar en registeredUsers
    const idxRegistered = this.registeredUsers.findIndex(u => u.email === email);
    if (idxRegistered !== -1) {
      this.registeredUsers.splice(idxRegistered, 1);
      this.saveRegisteredUsers();
      if (deletingSelf) {
        this.logout();
      }
      return true;
    }
    
    return false;
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

  // Obtener lista de usuarios permitidos (solo para admin) - incluye admins y clientes
  getAllowedUsers(): any[] {
    const allUsers = [
      ...this.allowedUsers.map(user => ({ 
        email: user.email, 
        role: user.role, 
        name: user.name 
      })),
      ...this.registeredUsers.map(user => ({ 
        email: user.email, 
        role: user.role, 
        name: user.name 
      }))
    ];
    return allUsers;
  }

  // Cantidad total de usuarios permitidos (para métricas del dashboard)
  getAllowedUsersCount(): number {
    return this.allowedUsers.length + this.registeredUsers.length;
  }

  // DEMO: Recuperar contraseña por email desde la lista local (no usar en producción)
  getPasswordForEmail(email: string): string | null {
    const found = this.allowedUsers.find(u => u.email === email);
    return found ? found.password : null;
  }
}