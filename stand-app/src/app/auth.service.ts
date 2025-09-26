import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Verificar si hay una sesión guardada en localStorage
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<boolean> {
    // Simulación de autenticación - en una app real harías una llamada HTTP
    return new Observable(observer => {
      setTimeout(() => {
        // Credenciales de ejemplo
        if (email === 'admin@stand.com' && password === '123456') {
          this.isAuthenticatedSubject.next(true);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userEmail', email);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000); // Simular delay de red
    });
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('userEmail');
  }
}
