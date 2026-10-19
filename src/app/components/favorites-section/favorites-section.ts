import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherCard } from '../teacher-card/teacher-card';

enum Direction {
  Left = -1,
  Right = 1
}

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

  Direction = Direction;

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

  onOpenTeacherModal(e: Event): void {
    e.preventDefault();

    const target = e.target as HTMLElement;
    const idElement = target.closest('[data-id]') as HTMLElement;
    if (!idElement) return

    const id = idElement.dataset['id'];
    this.selectTeacher.emit(id);
  }

  onSlide(track: HTMLElement, direction: Direction): void {
    const scrollAmount =  direction * (track.clientWidth || 300);    
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

}