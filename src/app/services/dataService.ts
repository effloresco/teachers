import { Service, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataService {
http = inject(HttpClient);

  getTeachers(results: number = 50): Observable<any[]> {
    const apiUrl = `https://randomuser.me/api/?results=${results}`;
    return this.http.get<any>(apiUrl).pipe(
      map(response => response.results)
    );
  }

}
