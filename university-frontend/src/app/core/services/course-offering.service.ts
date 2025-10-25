import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CourseOffering, CourseOfferingCreateRequest, CourseOfferingUpdateRequest } from '../models/course-offering.model';

@Injectable({
  providedIn: 'root'
})
export class CourseOfferingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/course-offerings`;

  getAllOfferings(): Observable<CourseOffering[]> {
    return this.http.get<CourseOffering[]>(this.apiUrl);
  }

  getOfferingById(id: number): Observable<CourseOffering> {
    return this.http.get<CourseOffering>(`${this.apiUrl}/${id}`);
  }

  getOfferingsByPeriod(periodId: number): Observable<CourseOffering[]> {
    return this.http.get<CourseOffering[]>(`${this.apiUrl}/period/${periodId}`);
  }

  getOpenOfferingsByPeriod(periodId: number): Observable<CourseOffering[]> {
    return this.http.get<CourseOffering[]>(`${this.apiUrl}/period/${periodId}/open`);
  }

  getOfferingsByProfessor(professorId: number): Observable<CourseOffering[]> {
    return this.http.get<CourseOffering[]>(`${this.apiUrl}/professor/${professorId}`);
  }

  getAvailableOfferings(): Observable<CourseOffering[]> {
    return this.http.get<CourseOffering[]>(`${this.apiUrl}/available`);
  }

  createOffering(offering: CourseOfferingCreateRequest): Observable<CourseOffering> {
    return this.http.post<CourseOffering>(this.apiUrl, offering);
  }

  updateOffering(id: number, offering: CourseOfferingUpdateRequest): Observable<CourseOffering> {
    return this.http.put<CourseOffering>(`${this.apiUrl}/${id}`, offering);
  }

  deleteOffering(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Acciones de estado
  openOffering(id: number): Observable<CourseOffering> {
    return this.http.patch<CourseOffering>(`${this.apiUrl}/${id}/open`, {});
  }

  closeOffering(id: number): Observable<CourseOffering> {
    return this.http.patch<CourseOffering>(`${this.apiUrl}/${id}/close`, {});
  }

  startOffering(id: number): Observable<CourseOffering> {
    return this.http.patch<CourseOffering>(`${this.apiUrl}/${id}/start`, {});
  }

  completeOffering(id: number): Observable<CourseOffering> {
    return this.http.patch<CourseOffering>(`${this.apiUrl}/${id}/complete`, {});
  }

  cancelOffering(id: number): Observable<CourseOffering> {
    return this.http.patch<CourseOffering>(`${this.apiUrl}/${id}/cancel`, {});
  }
}