import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherCard } from '../teacher-card/teacher-card';
import { DataService } from '../../services/dataService';

@Component({
  selector: 'app-teacher-section',
  imports: [CommonModule, TeacherCard],
  templateUrl: './teacher-section.html',
  styleUrl: './teacher-section.scss'
})
export class TeacherSection {
  @Output() selectTeacher = new EventEmitter<any>();

  dataService = inject(DataService);

  onAgeChange(event: any): void { 
    this.dataService.updateFilter('age', event.target.value); 
  }
  onRegionChange(event: any): void { 
    this.dataService.updateFilter('region', event.target.value); 
  }
  onSexChange(event: any): void { 
    this.dataService.updateFilter('sex', event.target.value); 
  }
  onPhotoChange(event: any): void { 
    this.dataService.updateFilter('onlyPhoto', event.target.checked); 
  }
  onFavoritesChange(event: any): void { 
    this.dataService.updateFilter('onlyFavorites', event.target.checked); 
  }

  onOpenTeacherModal(e: Event): void {
    e.preventDefault();

    const target = e.target as HTMLElement;
    const idElement = target.closest('[data-id]') as HTMLElement;
    if (!idElement) return

    const id = idElement.dataset['id'];
    this.selectTeacher.emit(id);
  }
}