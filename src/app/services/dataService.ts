import { Service, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { transformUsers } from '../utils/normalization';
import { filterTeachers } from '../utils/processing';

@Service()
export class DataService {
  http = inject(HttpClient);
  private teachersSignal = signal<any[]>([]);
  readonly teachers = this.teachersSignal.asReadonly();

  filterCountry = signal<string>('');
  filterAge = signal<string>('');
  filterRegion = signal<string>('');
  filterSex = signal<string>('');
  filterOnlyPhoto = signal<boolean>(false);
  filterOnlyFavorites = signal<boolean>(false);

  currentPage = signal<number>(1);
  readonly itemsPerPage = 10;

  readonly filteredTeachers = computed(() => {
    const list = this.teachersSignal();
    return filterTeachers(list, {
      country: this.filterCountry(),
      age: this.filterAge(),
      region: this.filterRegion(),
      sex: this.filterSex(),
      onlyPhoto: this.filterOnlyPhoto(),
      onlyFavorites: this.filterOnlyFavorites()
    });
  });

  loadTeachers(results: number = 50): void {
    const apiUrl = `https://randomuser.me/api/?results=${results}`;
    this.http.get<any>(apiUrl).pipe(
      map(response => transformUsers(response.results))).subscribe({
        next: (teachers) => {
          this.teachersSignal.update(current => [...current, ...teachers]);
        },
        error: (err) => console.error('Помилка завантаження:', err)
      });
  }

  addTeacher(teacherData: any): Observable<any> {
    const apiUrl = 'http://localhost:3000/teachers';
    this.teachersSignal.update(currentTeachers => [teacherData, ...currentTeachers])

    return this.http.post<any>(apiUrl, teacherData);
  }

  updateFilter(filterName: string, value: any): void {
    switch (filterName) {
      case 'country': this.filterCountry.set(value); break;
      case 'age': this.filterAge.set(value); break;
      case 'region': this.filterRegion.set(value); break;
      case 'sex': this.filterSex.set(value); break;
      case 'onlyPhoto': this.filterOnlyPhoto.set(value); break;
      case 'onlyFavorites': this.filterOnlyFavorites.set(value); break;
    }

    this.currentPage.set(1);
  }

  toggleFavorite(teacherOrId: any): void {
    const targetId = typeof teacherOrId === 'string' ? teacherOrId : (teacherOrId?.id || teacherOrId?.uuid);

    this.teachersSignal.update(currentTeachers =>
      currentTeachers.map(t => {
        const currentId = t.id || t.uuid;
        return currentId === targetId ? { ...t, favorite: !t.favorite } : t;
      })
    );
  }

}
