import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sales-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-stats.component.html',
  styleUrl: './sales-stats.component.css'
})
export class SalesStatsComponent implements OnInit, OnDestroy {
  totalRevenue = 0;
  totalClicks = 0;
  userStats: { email: string; clicks: number; spent: number }[] = [];
  private clicksSubscription?: Subscription;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.updateStats();
    
    // Actualizar estadísticas cuando hay nuevos clics
    this.clicksSubscription = this.productsService.clicks$.subscribe(() => {
      this.updateStats();
    });
  }

  ngOnDestroy(): void {
    this.clicksSubscription?.unsubscribe();
  }

  private updateStats(): void {
    this.totalRevenue = this.productsService.getTotalRevenue();
    this.totalClicks = this.productsService.getTotalClicks();
    this.userStats = this.productsService.getUserStats();
  }
}
