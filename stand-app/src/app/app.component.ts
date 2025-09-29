import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stand-app';
  showHeader$: Observable<boolean>;

  private hideOnRoutes = ['/login', '/admin'];

  constructor(private router: Router) {
    this.showHeader$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith({ url: this.router.url } as NavigationEnd),
      map((e: any) => {
        const url = e.url || '';
        return !this.hideOnRoutes.some(r => url.startsWith(r));
      })
    );
  }
}
