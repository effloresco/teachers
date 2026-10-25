import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-teacher-card',
  styleUrl: './teacher-card.scss',
  templateUrl: './teacher-card.html',
})
export class TeacherCard {
  @Input() teacher!: any;
  @Input() isCompact: boolean = false;

  @Output() cardClick = new EventEmitter<any>();
  @Output() toggleFavorite = new EventEmitter<any>();

  onCardClick(): void {
    this.cardClick.emit(this.teacher);
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.toggleFavorite.emit(this.teacher);
  }
}
