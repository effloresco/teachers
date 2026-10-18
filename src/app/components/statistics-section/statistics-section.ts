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
  @Output() selectUser = new EventEmitter<any>();
  @Output() teacherDataChange = new EventEmitter<any[]>();

  ITEMS_PER_PAGE = 10;
  currentStatsPage = 1;
  currentItems: any[] = [];
  pages: number[] = [];

  currentSortField: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teacherData']) {
      this.initPagination();
      this.loadTable(this.currentStatsPage);
    }
  }

  initPagination(): void {
    const totalPages = Math.ceil(this.teacherData.length / this.ITEMS_PER_PAGE);
    this.pages = [];
    for (let i = 1; i <= totalPages; i++) {
      this.pages.push(i);
    }
  }

  loadTable(page: number): void {
    this.currentStatsPage = page;
    const startIndex = (page - 1) * this.ITEMS_PER_PAGE;
    const endIndex = startIndex + this.ITEMS_PER_PAGE;
    this.currentItems = this.teacherData.slice(startIndex, endIndex);
  }

  onPageClick(e: Event, page: number): void {
    e.preventDefault();
    this.loadTable(page);
  }

  onSort(field: SortField): void {
    if (this.currentSortField === field) {
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortField = field;
      this.currentSortDirection = 'asc';
    }

    const sorted = sortUsers(this.teacherData, field, this.currentSortDirection);
    this.teacherDataChange.emit(sorted);
    this.loadTable(this.currentStatsPage);
  }

  onNameClick(e: Event, item: any): void {
    e.preventDefault();
    this.selectUser.emit(item);
  }
}