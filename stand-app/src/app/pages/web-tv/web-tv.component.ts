import { Component, AfterViewInit } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-web-tv',
  standalone: true,
  imports: [NgFor],
  templateUrl: './web-tv.component.html',
  styleUrls: ['./web-tv.component.css']
})
export class WebTvComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // Asegurar que todos los videos estén silenciados
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.muted = true;
      video.volume = 0;
    });
  }
}
