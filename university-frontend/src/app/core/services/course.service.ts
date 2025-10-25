import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course } from '../models/course.model';
import { CourseCreateRequest,PageResponse,CourseUpdateRequest } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }


  getCoursesPaginated(page: number, size: number, sort?: string): Observable<PageResponse<Course>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PageResponse<Course>>(`${this.apiUrl}/paginated`, { params });
  }


  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getCourseByCourseCode(courseCode: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/code/${courseCode}`);
    }

  createCourse(course: CourseCreateRequest): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/create`, course);
  }


  updateCourse(id: number, course: CourseUpdateRequest): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  getCoursesByStatus(status: 'ACTIVO' | 'INACTIVO'): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/status/${status}`);
  }

 
  getCoursesByDepartment(departmentId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/department/${departmentId}`);
  }

  getActiveCoursesByDepartment(departmentId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/department/${departmentId}/active`);
  }

  getCoursesByName(courseName: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/search?name=${encodeURIComponent(courseName)}`);
  }


  getCoursesByCredits(credits: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/credits/${credits}`);
  }


  activateCourse(id: number): Observable<Course> {
    return this.http.patch<Course>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateCourse(id: number): Observable<Course> {
    return this.http.patch<Course>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  checkCourseCodeExists(courseCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/code/${courseCode}`);
  }

  getCourseStatistics(): Observable<{
    total: number;
    active: number;
    inactive: number;
    byDepartment: { departmentName: string; count: number }[];
    byCredits: { credits: number; count: number }[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }
}
