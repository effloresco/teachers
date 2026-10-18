import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherCard } from '../teacher-card/teacher-card';

@Component({
  selector: 'app-favorites-section',
  standalone: true,
  imports: [CommonModule, TeacherCard],
  templateUrl: './favorites-section.html',
  styleUrl: './favorites-section.scss'
})
export class FavoritesSection {
  @Input() teacherData: any[] = [];
  @Output() selectTeacher = new EventEmitter<any>();

 get favoriteTeachers() {
    const allTeachers = [...this.teacherData];
    const favoritesMap = new Map();
    
    allTeachers.forEach(t => {
      if (t && t.favorite) {
        const key = t.id 
        
        if (key && !favoritesMap.has(key)) {
          favoritesMap.set(key, t);
        }
      }
    });
    return Array.from(favoritesMap.values());
  }

  onOpenTeacherModal(teacher: any): void {
    this.selectTeacher.emit(teacher);
  }

  onSlideLeft(): void {}
  onSlideRight(): void {}
}