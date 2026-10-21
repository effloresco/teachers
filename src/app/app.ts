import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { transformUsers, COUNTRIES } from './utils';
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
  standalone: true,
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
  receivedTeachers: any[] = [];
  countries = COUNTRIES;
  selectedTeacher: any = null;

  private dataService = inject(DataService);

  ngOnInit(): void {
    this.dataService.getTeachers().subscribe({
      next: (data) => {
        this.receivedTeachers = data;
        console.log('Завантажено:', data);
        this.teacherData.set(transformUsers(this.receivedTeachers));
        console.log('Перетворено:', this.teacherData);
      },
      error: (err) => {
        console.error('Помилка завантаження даних:', err);
      }
    });

  }

  openTeacherModal(teacher: any): void {
    const found = this.teacherData().find(item => item.id === teacher);
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

    const isSameTeacher = (a: any, b: any) => {
      if (a.email && b.email && a.email === b.email) return true;
      if (a.id && b.id && a.id === b.id) return true;

      const nameA = (a.full_name || `${a.firstName || ''} ${a.lastName || ''}`).trim().toLowerCase();
      const nameB = (b.full_name || `${b.firstName || ''} ${b.lastName || ''}`).trim().toLowerCase();
      return nameA.length > 0 && nameA === nameB;
    };

    this.teacherData.set(this.teacherData().map(t =>
      isSameTeacher(t, teacher) ? { ...t, favorite: newStatus } : t
    ));

    if (this.selectedTeacher && isSameTeacher(this.selectedTeacher, teacher)) {
      this.selectedTeacher = { ...this.selectedTeacher, favorite: newStatus };
    }
  }



  loadMoreTeachers(): void {
    this.dataService.getTeachers(10).subscribe({
      next: (newBatch) => {
        const transformed = transformUsers(newBatch);
        this.teacherData.update(current => [...current, ...transformed]);
      },
      error: (err) => console.error('Помилка довантаження:', err)
    });
  }

}

