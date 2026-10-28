import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/dataService'; // Перевірте шлях до вашого сервісу
import { getMatchingPercentage } from '../../utils/processing';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-chart-view',
  imports: [CommonModule],
  styleUrl: './chart-view.scss',
  templateUrl: './chart-view.html',
})
export class ChartView implements AfterViewInit, OnDestroy {
  dataService = inject(DataService);

  chart: any;
  selectedField: string = 'course';

  fields = [
    { key: 'course', label: 'Speciality' },
    { key: 'country', label: 'Nationality' },
    { key: 'gender', label: 'Gender' },
    { key: 'age', label: 'Age' }
  ];

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  changeField(fieldKey: string): void {
    this.selectedField = fieldKey;
    this.updateChartData();
  }

  private processData() {
    const teachers = this.dataService.filteredTeachers();
    const uniqueKeys = new Set<string>();

    teachers.forEach(teacher => {
      let val = teacher[this.selectedField];
      if (val === undefined || val === null || val === '') {
        val = 'Unknown';
      }
      uniqueKeys.add(String(val));
    });

    const labels = Array.from(uniqueKeys);

    const data = labels.map(key => {
      return getMatchingPercentage(teachers, (teacher) => {
        let val = teacher[this.selectedField];
        if (val === undefined || val === null || val === '') {
          val = 'Unknown';
        }
        return String(val) === key;
      });
    });

    return { labels, data };
  }

  addData(chart: any, label: string, newData: number) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset: any) => {
      dataset.data.push(newData);
    });
  }

  removeData(chart: any) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset: any) => {
      dataset.data.pop();
    });
  }

  renderChart() {
    const ctx = document.getElementById('canvas') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const { labels, data } = this.processData();
    const backgroundColors = labels.map((_, index) => {
      const hue = (index * 360) / labels.length;
      return `hsl(${hue}, 70%, 60%)`;
    });

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          label: `Percentage by ${this.selectedField}`,
          data: [],
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'left',
            maxWidth: 400,
            labels: {
              font: {
                size: 16
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.parsed}%`;
              }
            }
          }
        }
      }
    });

    labels.forEach((label, index) => {
      this.addData(this.chart, label, data[index]);
    });
    this.chart.update();
  }

  updateChartData() {
    if (!this.chart) {
      this.renderChart();
      return;
    }

    const { labels, data } = this.processData();

    const backgroundColors = labels.map((_, index) => {
      const hue = (index * 360) / labels.length;
      return `hsl(${hue}, 70%, 60%)`;
    });

    while (this.chart.data.labels.length > 0) {
      this.removeData(this.chart);
    }

    labels.forEach((label, index) => {
      this.addData(this.chart, label, data[index]);
    });

    this.chart.data.labels = labels;
    const dataset = this.chart.data.datasets[0];
    dataset.label = `Percentage by ${this.selectedField}`;
    dataset.data = data;
    dataset.backgroundColor = backgroundColors;
    this.chart.update();
  }
}