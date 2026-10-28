import { Component, inject, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/dataService';
import { SortField } from '../../utils/types';
import { sort } from '../../utils/processing';
import { ChartView } from '../../components/chart-view/chart-view';

@Component({
  selector: 'app-statistics-section',
  imports: [CommonModule, ChartView],
  templateUrl: './statistics-section.html',
  styleUrl: './statistics-section.scss'
})
export class StatisticsSection {
  @Output() selectTeacher = new EventEmitter<any>();
  chartView: boolean = false;

  dataService = inject(DataService);
  ITEMS_PER_PAGE = 10;
  currentPage = this.dataService.currentPage();
  currentSortField: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';
  columns = [
    { field: 'full_name', label: 'Name' },
    { field: 'course', label: 'Speciality' },
    { field: 'age', label: 'Age' },
    { field: 'gender', label: 'Gender' },
    { field: 'country', label: 'Nationality' }
  ];

  onPageClick(e: Event, page: number | string): void {
    e.preventDefault();
    if (typeof page === 'string') return;

    this.dataService.currentPage.set(page);
  }

  get currentItems(): any[] {
    const teachers = this.dataService.filteredTeachers();
    const page = this.dataService.currentPage();
    const limit = this.dataService.itemsPerPage;

    let dataToDisplay = [...teachers];

    if (this.currentSortField) {
      dataToDisplay = sort(dataToDisplay, this.currentSortField as SortField, this.currentSortDirection);
    }

    const startIndex = (page - 1) * limit;
    return dataToDisplay.slice(startIndex, startIndex + limit);
  }

  get pages(): (number | string)[] {
    const totalTeachers = this.dataService.filteredTeachers().length;
    const totalPages = Math.ceil(totalTeachers / this.dataService.itemsPerPage);
    const current = this.dataService.currentPage();
    const pagination: (number | string)[] = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pagination.push(i);
      }
    } else {
      pagination.push(1);

      if (current > 3) {
        pagination.push('...');
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pagination.push(i);
        }
      }

      if (current < totalPages - 2) {
        pagination.push('...');
      }

      if (totalPages > 1) {
        pagination.push(totalPages);
      }
    }

    return pagination;
  }

  onLoadMoreClick(e: Event): void {
    e.preventDefault();
    this.dataService.loadTeachers(10);
  }

  onSort(field: SortField): void {
    if (this.currentSortField === field) {
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortField = field;
      this.currentSortDirection = 'asc';
    }

    const sorted = sort([...this.currentItems], field, this.currentSortDirection);
  }

  onSortClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const columnElement = target.closest('[data-field]') as HTMLElement;

    if (!columnElement) return;

    const field = columnElement.dataset['field'];
    this.onSort(field as SortField);
  }

  onSelectClick(e: Event) {
    e.preventDefault();

    const target = e.target as HTMLElement;
    const idElement = target.closest('[data-id]') as HTMLElement;
    if (!idElement) return

    const id = idElement.dataset['id'];
    this.selectTeacher.emit(id);
  }

  switchClick(event: any): void {
    this.chartView = event.target.checked;
  }
}