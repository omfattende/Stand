import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter, map } from 'rxjs/operators';
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

  private hideOnRoutes = ['/login', '/register', '/admin', '/'];

  constructor(private router: Router) {
    this.showHeader$ = this.router.events.pipe(
      filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd),
      map((e: NavigationEnd) => {
        const url = e.url || '/';
        return !this.hideOnRoutes.some(r => url === r || (r !== '/' && url.startsWith(r)));
      })
    );
  }
}
