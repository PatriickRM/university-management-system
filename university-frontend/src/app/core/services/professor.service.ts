import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Professor, ProfessorCreateRequest, ProfessorUpdateRequest, PageResponse } from '../models/professor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/professors`;

  getAllProfessors(): Observable<Professor[]> {
    return this.http.get<Professor[]>(this.apiUrl);
  }

  getProfessorsPaginated(page: number, size: number, sort?: string): Observable<PageResponse<Professor>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PageResponse<Professor>>(`${this.apiUrl}/paginated`, { params });
  }

  getProfessorByUserId(userId: number): Observable<Professor> {
    return this.http.get<Professor>(`${this.apiUrl}/user/${userId}`);
  }

  getProfessorById(id: number): Observable<Professor> {
    return this.http.get<Professor>(`${this.apiUrl}/${id}`);
  }

  getProfessorByCode(code: string): Observable<Professor> {
    return this.http.get<Professor>(`${this.apiUrl}/code/${code}`);
  }

  createProfessor(professor: ProfessorCreateRequest): Observable<Professor> {
    return this.http.post<Professor>(this.apiUrl, professor);
  }

  updateProfessor(id: number, professor: ProfessorUpdateRequest): Observable<Professor> {
    return this.http.put<Professor>(`${this.apiUrl}/${id}`, professor);
  }

  deleteProfessor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProfessorsByDepartment(departmentId: number): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.apiUrl}/department/${departmentId}`);
  }

  getProfessorsBySpecialization(specialization: string): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.apiUrl}/specialization?specialization=${specialization}`);
  }
}