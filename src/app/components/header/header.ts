import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { find } from '../../utils/processing';
import { DataService } from '../../services/dataService';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Output() selectTeacher = new EventEmitter<any>();

  dataService = inject(DataService);
  searchQuery: string = '';
  searchResults: any[] = [];
  isSearchActive: boolean = false;

  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.searchResults = [];
      this.isSearchActive = false;
    }
  }

  onSearchClick(): void {
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      this.searchResults = find(this.dataService.teachers(), this.searchQuery);
      this.isSearchActive = true;
    } else {
      this.searchResults = [];
      this.isSearchActive = false;
    }
  }

  onSearchKeyUp(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.onSearchClick();
    }
  }

  onCloseSearch(): void {
    this.isSearchActive = false;
    this.searchResults = [];
  }

  onNameClick(event: Event): void {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const idElement = target.closest('[data-id]') as HTMLElement;
    if (!idElement) return

    const id = idElement.dataset['id'];
    this.selectTeacher.emit(id);
  }

  onAddTeacherClick(): void {
    const modal = document.getElementById('add-teacher');
    if (modal && typeof (modal as any).showPopover === 'function') {
      (modal as any).showPopover();
    }
  }
}