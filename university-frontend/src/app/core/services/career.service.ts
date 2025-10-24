import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Career } from '../models/career.model';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/careers`;

  getAllCareers(): Observable<Career[]> {
    return this.http.get<Career[]>(this.apiUrl);
  }

  getCareerById(id: number): Observable<Career> {
    return this.http.get<Career>(`${this.apiUrl}/${id}`);
  }

  getCareerByCode(code: string): Observable<Career> {
    return this.http.get<Career>(`${this.apiUrl}/code/${code}`);
  }

  getActiveCareers(): Observable<Career[]> {
    return this.http.get<Career[]>(`${this.apiUrl}/status/ACTIVO`);
  }

  getCareersByDepartment(departmentId: number): Observable<Career[]> {
    return this.http.get<Career[]>(`${this.apiUrl}/department/${departmentId}`);
  }
}