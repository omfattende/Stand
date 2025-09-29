import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [NgFor],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent {}
