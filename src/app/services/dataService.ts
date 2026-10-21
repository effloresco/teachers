import { Service, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataService {
http = inject(HttpClient);
  private apiUrl = 'https://randomuser.me/api/?results=50';

  getTeachers():Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.results)
    );
  }

}
