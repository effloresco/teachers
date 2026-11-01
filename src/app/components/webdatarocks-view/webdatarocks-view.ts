import { Component, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/dataService';
import WebDataRocks from '@webdatarocks/webdatarocks';

@Component({
  selector: 'app-webdatarocks-view',
  imports: [CommonModule],
  templateUrl: './webdatarocks-view.html',
  styleUrl: './webdatarocks-view.scss'
})
export class WebdatarocksViewComponent implements OnDestroy {
  dataService = inject(DataService);
  wdr: any;
  currentMode: 'flat' | 'country' = 'flat';

  columnSizes: any[] = [ 
          { idx: 0, width: 200 },
          { idx: 1, width: 200 },
          { idx: 2, width: 75 },
          { idx: 3, width: 200 },
          { idx: 4, width: 200 }];

  constructor() {
    effect(() => {
      const teachers = this.dataService.filteredTeachers();
      const container = document.getElementById('wdr-container');

      if (!container) return;
      if (!this.wdr && teachers.length > 0) {
        this.initWebDataRocks(teachers);
      }
      else if (this.wdr && teachers.length > 0) {
        this.updateWdrData();
      }
    });
  }

  ngOnDestroy() {
    if (this.wdr && typeof this.wdr.dispose === 'function') {
      this.wdr.dispose();
    }
  }

  getFormattedData(teachers: any[]) {
    return teachers.map((t: any) => ({
      'Full Name': t.full_name || '',
      'Speciality': t.course || '',
      'Age': t.age || 0,
      'Gender': t.gender || '',
      'Country': t.country || ''
    }));
  }

  initWebDataRocks(teachers: any[]) {
    if (this.wdr) return;

    const data = this.getFormattedData(teachers);

    this.wdr = new WebDataRocks({
      container: '#wdr-container',
      toolbar: true,
      report: {
        dataSource: {
          dataSourceType: "json",
          data: data
        },
        options: {
          grid: {
            type: this.currentMode === 'flat' ? 'flat' : 'compact',
            showGrandTotals: false
          }
        },
        tableSizes: this.currentMode === 'flat' ? {
          columns: this.columnSizes
        } : undefined
      }
    });
  }

  updateWdrData() {
    if (!this.wdr) return;

    const data = this.getFormattedData(this.dataService.teachers());
    const currentReport = this.wdr.getReport();

    if (currentReport) {
      currentReport.dataSource = {
        dataSourceType: "json",
        data: data
      };

      if (this.currentMode === 'flat') {
        currentReport.tableSizes = {
          columns: this.columnSizes
        };
      }

      this.wdr.setReport(currentReport);
    }
  }

  showFlatTable() {
    this.currentMode = 'flat';
    if (!this.wdr) return;
    this.wdr.setReport({
      dataSource: {
        dataSourceType: "json",
        data: this.getFormattedData(this.dataService.teachers())
      },
      options: {
        grid: {
          type: 'flat',
          showGrandTotals: false
        }
      },
      tableSizes: {
        columns: this.columnSizes
      }
    });
  }

  showCountryReport() {
    this.currentMode = 'country';
    if (!this.wdr) return;
    this.wdr.setReport({
      dataSource: {
        dataSourceType: "json",
        data: this.getFormattedData(this.dataService.teachers())
      },
      slice: {
        rows: [
          { uniqueName: 'Country' },
          { uniqueName: 'Speciality' }
        ],
        measures: [
          { uniqueName: 'Full Name', aggregation: 'count', caption: 'Teachers Count' }
        ]
      },
      options: {
        grid: {
          type: 'compact'
        }
      }
    });
  }

  onLoadMore(e: Event): void {
    e.preventDefault();
    this.dataService.loadTeachers(10);
  }
}