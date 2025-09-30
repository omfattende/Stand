import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  isHome = false;
  navHeight = 0;
  @ViewChild('navbarEl') navbarEl!: ElementRef<HTMLElement>;

  constructor(public nav: NavigationService, private router: Router, private auth: AuthService) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith({ url: this.router.url } as NavigationEnd)
    ).subscribe((e: any) => {
      const url: string = e.url || '';
      this.isHome = url.startsWith('/home') || url === '/';
      // Recalculate on route change (layout may shift)
      setTimeout(() => this.updateNavHeight());
    });
  }

  ngAfterViewInit(): void {
    this.updateNavHeight();
  }

  @HostListener('window:resize') onResize() {
    this.updateNavHeight();
  }

  private updateNavHeight() {
    const el = this.navbarEl?.nativeElement;
    if (el) {
      this.navHeight = el.offsetHeight;
    }
  }

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  deleteMyAccount(): void {
    const user = this.auth.getCurrentUser();
    const email = user?.email || '';
    if (!email) return;
    
    // Evitar que el admin elimine su propia cuenta
    if (this.auth.isAdmin()) return;
    
    const ok = confirm(`¿Eliminar tu cuenta (${email})?`);
    if (!ok) return;
    const removed = this.auth.deleteCurrentUser();
    if (removed) {
      this.router.navigate(['/login']);
    }
  }
}
