import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface ProductClick {
  productId: number;
  userEmail: string;
  timestamp: number;
}

export interface ProductStats {
  productId: number;
  productName: string;
  totalClicks: number;
  clicksByUser: { [email: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Playera de la EIAO (Edicion 2025)',
      description: 'Playera mas actual que tenemos. En la compra de una te llevas otra con nuevo diseño.',
      price: 500,
      image: '../../../assets/imagenes/Playeras/WhatsApp Image 2025-09-30 at 11.35.23 PM (1).jpeg',
      category: 'Playeras'
    },
    {
      id: 2,
      name: 'Playera de la EIAO (Edicion 2024)',
      description: 'Playera mas actual que tenemos. En la compra de una te llevas otra con nuevo diseño.',
      price: 500,
      image: '../../../assets/imagenes/Playeras/WhatsApp Image 2025-09-30 at 11.35.23 PM (2).jpeg',
      category: 'Playeras'
    },
    {
      id: 3,
      name: 'Playera de la EIAO (Edicion 2023)',
      description: 'Playera mas actual que tenemos. En la compra de una te llevas otra con nuevo diseño.',
      price: 500,
      image: '../../../assets/imagenes/Playeras/WhatsApp Image 2025-09-30 at 11.35.23 PM (3).jpeg',
      category: 'Playeras'
    },
    {
      id: 4,
      name: 'Playera de la EIAO (Edicion 2023)',
      description: 'Playera mas actual que tenemos. En la compra de una te llevas otra con nuevo diseño.',
      price: 500,
      image: '../../../assets/imagenes/Playeras/WhatsApp Image 2025-09-30 at 11.35.23 PM (4).jpeg',
      category: 'Playeras'
    },
    {
      id: 5,
      name: 'Playera de la EIAO (Edicion 2022)',
      description: 'Playera mas actual que tenemos. En la compra de una te llevas otra con nuevo diseño',
      price: 500,
      image: '../../../assets/imagenes/Playeras/WhatsApp Image 2025-09-30 at 11.35.23 PM.jpeg',
      category: 'Playera'
    },
    {
      id: 6,
      name: 'Colgante de la EIAO (Edicion Programación Web)',
      description: 'Colgante moderno para nuestros gafetes',
      price: 50,
      image: '../../../assets/imagenes/Playeras/WhatsApp Image 2025-09-30 at 11.53.08 PM.jpeg',
      category: 'Colgante'
    }
  ];

  private clicks: ProductClick[] = [];
  private clicksSubject = new BehaviorSubject<ProductClick[]>([]);
  public clicks$ = this.clicksSubject.asObservable();

  constructor() {
    this.loadClicks();
  }

  private loadClicks(): void {
    const saved = localStorage.getItem('productClicks');
    if (saved) {
      try {
        this.clicks = JSON.parse(saved);
        this.clicksSubject.next(this.clicks);
      } catch {
        this.clicks = [];
      }
    }
  }

  private saveClicks(): void {
    localStorage.setItem('productClicks', JSON.stringify(this.clicks));
    this.clicksSubject.next(this.clicks);
  }

  getProducts(): Product[] {
    return [...this.products];
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  // Registrar un clic en un producto
  trackClick(productId: number, userEmail: string): void {
    const click: ProductClick = {
      productId,
      userEmail,
      timestamp: Date.now()
    };
    this.clicks.push(click);
    this.saveClicks();
  }

  // Obtener estadísticas de todos los productos
  getProductStats(): ProductStats[] {
    const stats: ProductStats[] = [];

    this.products.forEach(product => {
      const productClicks = this.clicks.filter(c => c.productId === product.id);
      const clicksByUser: { [email: string]: number } = {};

      productClicks.forEach(click => {
        if (!clicksByUser[click.userEmail]) {
          clicksByUser[click.userEmail] = 0;
        }
        clicksByUser[click.userEmail]++;
      });

      stats.push({
        productId: product.id,
        productName: product.name,
        totalClicks: productClicks.length,
        clicksByUser
      });
    });

    return stats;
  }

  // Obtener clics totales por producto
  getClicksByProduct(): { productName: string; clicks: number }[] {
    return this.products.map(product => {
      const clicks = this.clicks.filter(c => c.productId === product.id).length;
      return {
        productName: product.name,
        clicks
      };
    });
  }

  // Limpiar todas las estadísticas
  clearStats(): void {
    this.clicks = [];
    this.saveClicks();
  }

  // Calcular total recaudado (suma de precios de productos clickeados)
  getTotalRevenue(): number {
    return this.clicks.reduce((total, click) => {
      const product = this.getProductById(click.productId);
      return total + (product?.price || 0);
    }, 0);
  }

  // Obtener estadísticas por usuario
  getUserStats(): { email: string; clicks: number; spent: number }[] {
    const userMap = new Map<string, { clicks: number; spent: number }>();

    this.clicks.forEach(click => {
      const product = this.getProductById(click.productId);
      const price = product?.price || 0;

      if (!userMap.has(click.userEmail)) {
        userMap.set(click.userEmail, { clicks: 0, spent: 0 });
      }

      const stats = userMap.get(click.userEmail)!;
      stats.clicks++;
      stats.spent += price;
    });

    return Array.from(userMap.entries()).map(([email, stats]) => ({
      email,
      clicks: stats.clicks,
      spent: stats.spent
    })).sort((a, b) => b.spent - a.spent); // Ordenar por gasto descendente
  }

  // Obtener total de clics
  getTotalClicks(): number {
    return this.clicks.length;
  }
}
