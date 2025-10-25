import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AcademicPeriod, AcademicPeriodCreateRequest, AcademicPeriodUpdateRequest } from '../models/academic-period.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicPeriodService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/academic-periods`;

  getAllPeriods(): Observable<AcademicPeriod[]> {
    return this.http.get<AcademicPeriod[]>(this.apiUrl);
  }

  getPeriodById(id: number): Observable<AcademicPeriod> {
    return this.http.get<AcademicPeriod>(`${this.apiUrl}/${id}`);
  }

  getActivePeriod(): Observable<AcademicPeriod> {
    return this.http.get<AcademicPeriod>(`${this.apiUrl}/active`);
  }

  getPeriodsByStatus(status: string): Observable<AcademicPeriod[]> {
    return this.http.get<AcademicPeriod[]>(`${this.apiUrl}/status/${status}`);
  }

  createPeriod(period: AcademicPeriodCreateRequest): Observable<AcademicPeriod> {
    return this.http.post<AcademicPeriod>(this.apiUrl, period);
  }

  updatePeriod(id: number, period: AcademicPeriodUpdateRequest): Observable<AcademicPeriod> {
    return this.http.put<AcademicPeriod>(`${this.apiUrl}/${id}`, period);
  }

  deletePeriod(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
