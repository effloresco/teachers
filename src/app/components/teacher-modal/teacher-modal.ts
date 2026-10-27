import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Map } from '../map/map';

@Component({
  selector: 'app-teacher-modal',
  imports: [CommonModule, Map],
  templateUrl: './teacher-modal.html',
  styleUrl: './teacher-modal.scss'
})
export class TeacherModal {
  @Input() selectedTeacher: any = null;
  @Output() toggleFavorite = new EventEmitter<any>();

  showMap: boolean = false;

  onToggleFavorite(teacher: any): void {
    this.toggleFavorite.emit(teacher);
  }

  onToggleMap(event: Event): void {
    event.preventDefault();
    this.showMap = !this.showMap;

  }

  closeTeacherModal(){
    const modal = document.getElementById('teacher-modal');
    if (modal && typeof (modal as any).hidePopover === 'function') {
      (modal as any).hidePopover();
    }
    this.selectedTeacher = null;
  } 

  beforeToggle(event: ToggleEvent) {
    if (event.newState === 'closed') {
    event.preventDefault();

    console.log("before toggle " + event.newState)
        this.closeTeacherModal()
      }
  }
}