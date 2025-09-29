import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [NgFor],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent {}
