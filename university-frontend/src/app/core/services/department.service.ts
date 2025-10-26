import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Department } from '../models/professor.model';
import { PageResponse } from '../models/student.model'; 
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/department`;

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  createDepartment(department: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }

  updateDepartment(id: number, department: Partial<Department>): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getActiveDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/status/ACTIVO`);
  }

  searchDepartmentsByName(name: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/search?name=${name}`);
  }

  getDepartmentsPage(page: number, size: number): Observable<PageResponse<Department>> {
    return this.http.get<PageResponse<Department>>(`${this.apiUrl}/paginated?page=${page}&size=${size}`);
  }
}
