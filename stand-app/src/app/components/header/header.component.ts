import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { NgIf } from '@angular/common';

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

  constructor(public nav: NavigationService, private router: Router) {
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
}
