import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-web-tv',
  standalone: true,
  imports: [NgFor],
  templateUrl: './web-tv.component.html',
  styleUrls: ['./web-tv.component.css']
})
export class WebTvComponent {}
