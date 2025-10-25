import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Enrollment, EnrollmentCreateRequest } from '../models/enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/enrollments`;

  createEnrollment(request: EnrollmentCreateRequest): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.apiUrl, request);
  }

  getEnrollmentsByStudent(studentId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getEnrollmentsByStudentAndPeriod(studentId: number, periodId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/student/${studentId}/period/${periodId}`);
  }

  withdrawEnrollment(id: number): Observable<Enrollment> {
    return this.http.patch<Enrollment>(`${this.apiUrl}/${id}/withdraw`, {});
  }

  updateEnrollment(id: number, request: any): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}/${id}`, request);
  }

  deleteEnrollment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  completeEnrollment(id: number): Observable<Enrollment> {
    return this.http.patch<Enrollment>(`${this.apiUrl}/${id}/complete`, {});
  }

  approveEnrollment(id: number, finalGrade: number): Observable<Enrollment> {
    return this.http.patch<Enrollment>(`${this.apiUrl}/${id}/approve?finalGrade=${finalGrade}`, {});
  }

  failEnrollment(id: number, finalGrade: number): Observable<Enrollment> {
    return this.http.patch<Enrollment>(`${this.apiUrl}/${id}/fail?finalGrade=${finalGrade}`, {});
  }

  getEnrollmentsByStatus(status: string): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/status/${status}`);
  }

  getEnrollmentsByCourseOffering(courseOfferingId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/course-offering/${courseOfferingId}`);
  }

  getEnrollmentsByStudentAndStatus(studentId: number, status: string): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/student/${studentId}/status/${status}`);
  }

}   