import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortField, sortUsers } from '../../utils';

@Component({
  selector: 'app-statistics-section',
  imports: [CommonModule],
  templateUrl: './statistics-section.html',
  styleUrl: './statistics-section.scss'
})
export class StatisticsSection implements OnChanges {
  @Input() teacherData: any[] = [];
  @Output() selectTeacher = new EventEmitter<any>();
  @Output() loadMoreTeachers = new EventEmitter<void>();

  ITEMS_PER_PAGE = 10;
  currentStatsPage = 1;
  currentItems: any[] = [];
  pages: (number | string)[] = [];

  currentSortField: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';
  columns = [
  { field: 'full_name', label: 'Name' },
  { field: 'course', label: 'Speciality' },
  { field: 'age', label: 'Age' },
  { field: 'gender', label: 'Gender' },
  { field: 'country', label: 'Nationality' }
];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teacherData']) {
      const currentValue = changes['teacherData'].currentValue;
      if (Array.isArray(currentValue)) {
        this.initPagination();
        this.loadTable(this.currentStatsPage);
      }
    }
  }

  initPagination(): void {
    if (!Array.isArray(this.teacherData)) return;

    const totalPages = Math.ceil(this.teacherData.length / this.ITEMS_PER_PAGE);
    const current = this.currentStatsPage;
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

    this.pages = pagination;
  }

  loadTable(page: number): void {
   this.currentStatsPage = page;

    if (!Array.isArray(this.teacherData)) {
      this.currentItems = [];
      return;
    }

    const startIndex = (page - 1) * this.ITEMS_PER_PAGE;
    const endIndex = startIndex + this.ITEMS_PER_PAGE;
    this.currentItems = this.teacherData.slice(startIndex, endIndex);
    
    this.initPagination();
  }

  onPageClick(e: Event, page: number | string): void {
    e.preventDefault();
    if (typeof page === 'string') return;

    this.loadTable(page);
  }

  onLoadMoreClick(e: Event): void {
    e.preventDefault();
    this.loadMoreTeachers.emit();
  }

  onSort(field: SortField): void {
    if (this.currentSortField === field) {
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortField = field;
      this.currentSortDirection = 'asc';
    }

    const sorted = sortUsers([...this.teacherData], field, this.currentSortDirection);
    this.currentItems = sorted.slice((this.currentStatsPage - 1) * this.ITEMS_PER_PAGE, this.currentStatsPage * this.ITEMS_PER_PAGE);

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
}