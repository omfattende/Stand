import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { Subscription } from 'rxjs';

interface ChartData {
  productName: string;
  clicks: number;
  percentage: number;
}

@Component({
  selector: 'app-product-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-chart.component.html',
  styleUrl: './product-chart.component.css'
})
export class ProductChartComponent implements OnInit, OnDestroy {
  chartData: ChartData[] = [];
  maxClicks = 0;
  private clicksSubscription?: Subscription;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.updateChart();
    
    // Actualizar gráfica cuando hay nuevos clics
    this.clicksSubscription = this.productsService.clicks$.subscribe(() => {
      this.updateChart();
    });
  }

  ngOnDestroy(): void {
    this.clicksSubscription?.unsubscribe();
  }

  private updateChart(): void {
    const data = this.productsService.getClicksByProduct();
    this.maxClicks = Math.max(...data.map(d => d.clicks), 1); // Mínimo 1 para evitar división por 0

    this.chartData = data.map(item => ({
      productName: item.productName,
      clicks: item.clicks,
      percentage: (item.clicks / this.maxClicks) * 100
    }));
  }

  clearStats(): void {
    if (confirm('¿Estás seguro de que quieres limpiar todas las estadísticas?')) {
      this.productsService.clearStats();
      this.updateChart();
    }
  }
}
