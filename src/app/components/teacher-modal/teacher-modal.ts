import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-modal',
  imports: [CommonModule],
  templateUrl: './teacher-modal.html',
  styleUrl: './teacher-modal.scss'
})
export class TeacherModal {
  @Input() selectedTeacher: any = null;
  @Output() toggleFavorite = new EventEmitter<any>();

  onToggleFavorite(teacher: any): void {
    this.toggleFavorite.emit(teacher);
  }

  onToggleMap(event: Event): void {
    event.preventDefault();
  }

  closeTeacherModal(){
    const modal = document.getElementById('teacher-modal');
    if (modal && typeof (modal as any).hidePopover === 'function') {
      (modal as any).hidePopover();
    }
    this.selectedTeacher = null;

  }
}