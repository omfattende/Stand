import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private router: Router) {}

  toHome() { this.router.navigateByUrl('/home'); }
  toCollection() { this.router.navigateByUrl('/collection'); }
  toAbout() { this.router.navigateByUrl('/about'); }
  toContact() { this.router.navigateByUrl('/contact'); }
  toWebTv() { this.router.navigateByUrl('/web-tv'); }
  toMapa() { this.router.navigateByUrl('/mapa'); }
  toGaleria() { this.router.navigateByUrl('/galeria'); }
}
