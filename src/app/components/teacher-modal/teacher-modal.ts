import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Map } from '../map/map';
import dayjs from 'dayjs';

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
  daysToBD: number =  0;
  formattedBirthday: any = null;

  ngOnChanges(): void {
    if (this.selectedTeacher) {
      this.calculateDaysToBirthday();
    }
  }

  calculateDaysToBirthday(): void {
    const birthday = this.selectedTeacher?.b_date || this.selectedTeacher?.b_day;
    if (!birthday) {
      this.daysToBD = 0;
      return;
    }

    const now = dayjs();
    const bDate = dayjs(birthday);
    this.formattedBirthday = bDate.format('DD/MM/YYYY')
    
    let nextBd = bDate.year(now.year());

    if (nextBd.isBefore(now, 'day')) {
      nextBd = nextBd.add(1, 'year');
    }

    this.daysToBD = nextBd.diff(now, 'day');
  }


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