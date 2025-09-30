import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService, Product } from '../../services/products.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productsService: ProductsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.products = this.productsService.getProducts();
  }

  onProductClick(product: Product): void {
    const user = this.authService.getCurrentUser();
    const userEmail = user?.email || 'guest@anonymous.com';
    
    // Registrar el clic
    this.productsService.trackClick(product.id, userEmail);
    
    // Mostrar notificación
    console.log(`Clic registrado en ${product.name} por ${userEmail}`);
    
    // Aquí podrías agregar lógica adicional como abrir un modal con detalles
    alert(`Has clickeado en: ${product.name}\n${product.description}\nPrecio: $${product.price}`);
  }
}
