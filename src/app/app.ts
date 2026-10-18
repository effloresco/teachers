import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { randomUserMock, additionalUsers} from './teacherData';
import { transformUsers, COUNTRIES } from './utils';

import { Header } from './components/header/header';
import { TeacherSection } from './components/teacher-section/teacher-section';
import { StatisticsSection } from './components/statistics-section/statistics-section';
import { FavoritesSection } from './components/favorites-section/favorites-section';
import { AboutSection } from './components/about-section/about-section';
import { Footer } from './components/footer/footer';
import { AddTeacherModal } from './components/add-teacher-modal/add-teacher-modal';
import { TeacherModal } from './components/teacher-modal/teacher-modal';

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
  teacherData = transformUsers(randomUserMock, additionalUsers);
  countries = COUNTRIES;
  selectedTeacher: any = null;

  ngOnInit(): void {
    this.teacherData.forEach(t => { if (t.favorite === undefined) t.favorite = false; });
    this.teacherData.forEach(u => { if (u.favorite === undefined) u.favorite = false; });

    
  }

  openTeacherModal(teacher: any): void {
    this.selectedTeacher = teacher;
    const modal = document.getElementById('teacher-modal');
    if (modal && typeof (modal as any).showPopover === 'function') {
      (modal as any).showPopover();
    }
  }

  addTeacher(newTeacher: any): void {
    this.teacherData.unshift(newTeacher);
    this.teacherData = [...this.teacherData];
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

    this.teacherData = this.teacherData.map(t => 
      isSameTeacher(t, teacher) ? { ...t, favorite: newStatus } : t
    );

    this.teacherData = this.teacherData.map(u => 
      isSameTeacher(u, teacher) ? { ...u, favorite: newStatus } : u
    );

    if (this.selectedTeacher && isSameTeacher(this.selectedTeacher, teacher)) {
      this.selectedTeacher = { ...this.selectedTeacher, favorite: newStatus };
    }
  }

}