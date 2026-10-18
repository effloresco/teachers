import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { findUsers } from '../../utils';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Input() teacherData: any[] = [];
  @Output() selectUser = new EventEmitter<any>();

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
      this.searchResults = findUsers(this.teacherData, this.searchQuery);
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

  onNameClick(event: Event, user: any): void {
    event.preventDefault();
    this.selectUser.emit(user);
    this.onCloseSearch();
  }

  onAddTeacherClick(): void {
    const modal = document.getElementById('add-teacher');
    if (modal && typeof (modal as any).showPopover === 'function') {
      (modal as any).showPopover();
    }
  }
}