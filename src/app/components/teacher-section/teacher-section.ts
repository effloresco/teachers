import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filterTeachers } from '../../utils';
import { TeacherCard } from '../teacher-card/teacher-card';

@Component({
  selector: 'app-teacher-section',
  imports: [CommonModule, TeacherCard],
  templateUrl: './teacher-section.html',
  styleUrl: './teacher-section.scss'
})
export class TeacherSection {
  @Input() teacherData: any[] = [];
  @Output() selectTeacher = new EventEmitter<any>();

  filterCountry: string = '';
  filterAge: string = '';
  filterRegion: string = '';
  filterSex: string = '';
  filterOnlyPhoto: boolean = false;
  filterOnlyFavorites: boolean = false;

  onAgeChange(event: any): void { this.filterAge = event.target.value; }
  onRegionChange(event: any): void { this.filterRegion = event.target.value; }
  onSexChange(event: any): void { this.filterSex = event.target.value; }
  onPhotoChange(event: any): void { this.filterOnlyPhoto = event.target.checked; }
  onFavoritesChange(event: any): void { this.filterOnlyFavorites = event.target.checked; }

  get filteredTeachers() {
    return filterTeachers(this.teacherData, {
      country: this.filterCountry,
      age: this.filterAge,
      region: this.filterRegion,
      sex: this.filterSex,
      onlyPhoto: this.filterOnlyPhoto,
      onlyFavorites: this.filterOnlyFavorites
    });
  }

  onOpenTeacherModal(teacher: any): void {
    this.selectTeacher.emit(teacher);
  }
}