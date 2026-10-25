import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { TeacherSection } from './components/teacher-section/teacher-section';
import { StatisticsSection } from './components/statistics-section/statistics-section';
import { FavoritesSection } from './components/favorites-section/favorites-section';
import { AboutSection } from './components/about-section/about-section';
import { Footer } from './components/footer/footer';
import { AddTeacherModal } from './components/add-teacher-modal/add-teacher-modal';
import { TeacherModal } from './components/teacher-modal/teacher-modal';
import { DataService } from './services/dataService';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    Header,
    TeacherSection,
    StatisticsSection,
    FavoritesSection,
    AboutSection,
    Footer,
    AddTeacherModal,
    TeacherModal
  ],
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App implements OnInit {
  teacherData = signal([] as any[]);
  selectedTeacher: any = null;
  dataService = inject(DataService);

  ngOnInit(): void {
    this.dataService.loadTeachers();
  }

  openTeacherModal(teacher: any): void {
    const found = this.dataService.teachers().find(item => item.id === teacher);
    this.selectedTeacher = found;
    const modal = document.getElementById('teacher-modal');
    if (modal && typeof (modal as any).showPopover === 'function') {
      (modal as any).showPopover();
    }
  }

  addTeacher(newTeacher: any): void {
    this.teacherData.update(teachers => [newTeacher, ...teachers]);
  }

  toggleFavorite(teacher: any): void {
    const newStatus = !teacher.favorite;
      this.selectedTeacher = { ...this.selectedTeacher, favorite: newStatus };
    this.dataService.toggleFavorite(teacher);
  }

  loadMoreTeachers(): void {
    this.dataService.loadTeachers(10)
  }

}

