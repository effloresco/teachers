import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createNewTeacher, validateUser } from '../../utils';

@Component({
  selector: 'app-add-teacher-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-teacher-modal.html',
  styleUrl: './add-teacher-modal.scss'
})
export class AddTeacherModal {
  @Input() countries: any[] = [];
  @Output() teacherAdded = new EventEmitter<any>();

  isValid: boolean = true;
  messages: string[] = [];

  onAddTeacher(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const teacherData = {
      full_name: (formData.get('fullName') as string) || '',
      course: (formData.get('course') as string) || 'Mathematics',
      country: (formData.get('country') as string) || 'Ukraine',
      city: (formData.get('city') as string) || '',
      email: (formData.get('email') as string) || '',
      phone: (formData.get('phone') as string) || '',
      dob: (formData.get('dob') as string) || '',
      gender: (formData.get('gender') as string) || '',
      bgColor: (formData.get('bgColor') as string) || '#ffffff',
      note: (formData.get('note') as string) || ''
    };

    const newTeacher = createNewTeacher(teacherData);
    let validationResult = validateUser(newTeacher);

    this.isValid = validationResult.isValid;

    if (this.isValid) {
      this.teacherAdded.emit(newTeacher);

      form.reset();
      this.onClose();
    }
    else{
      this.messages = validationResult.messages;
    }
  }

  onClose(): void {
    const modal = document.getElementById('add-teacher');
    if (modal && typeof (modal as any).hidePopover === 'function') {
      (modal as any).hidePopover();
    }
  }
}