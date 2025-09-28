import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  // Lista de cuentas permitidas para mostrar en el login
  allowedAccounts = [
    { email: 'admin@stand.com', password: '123456', type: 'Administrador' },
    { email: 'sales@stand.com', password: '123456', type: 'Ventas' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            const user = this.authService.getCurrentUser();
            console.log('Usuario autenticado:', user);
            
            // Redirigir basado en el rol
            if (this.authService.isAdmin()) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/sales']);
            }
          } else {
            this.errorMessage = 'Credenciales incorrectas o usuario no autorizado.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName === 'email' ? 'Email' : 'Contraseña'} es requerido`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        return 'La contraseña debe tener al menos 6 caracteres';
      }
    }
    return '';
  }

  // Método para llenar el formulario con cuentas de prueba
  fillForm(account: any): void {
    this.loginForm.patchValue({
      email: account.email,
      password: account.password
    });
  }
}