import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartView } from '../chart-view/chart-view';
import { WebdatarocksViewComponent } from '../webdatarocks-view/webdatarocks-view';

@Component({
  selector: 'app-statistics-section',
  imports: [CommonModule, ChartView, WebdatarocksViewComponent],
  templateUrl: './statistics-section.html',
  styleUrl: './statistics-section.scss'
})
export class StatisticsSection {
  chartView: boolean = false;

  switchClick(event: any): void {
    this.chartView = event.target.checked;
  }
}