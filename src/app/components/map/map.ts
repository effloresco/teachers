import { Component, AfterViewInit, Input, OnChanges } from '@angular/core';
import * as L from 'leaflet';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  styleUrl: './map.scss',
  templateUrl: './map.html',
})
export class Map implements OnChanges, AfterViewInit {
  @Input() coords: any = null;
  private map: any;
  private marker: any = null;

  private initMap(): void {
    const lat = this.coords?.latitude || 0;
    const lng = this.coords?.longitude || 0;
    this.map = L.map('map', {
      center: [lat, lng],
      zoom: 3
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    this.marker = L.marker([lat, lng]).addTo(this.map);
  }

  ngOnChanges(): void {
  const lat = this.coords?.latitude || 0;
    const lng = this.coords?.longitude || 0;

    if (this.map) {
      this.map.setView([lat, lng], 3);

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }
    }

}

ngAfterViewInit(): void {
    this.initMap();
  }

}

