import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Student, StudentCreateRequest, StudentUpdateRequest, PageResponse } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/students`;

  // Obtener todos los estudiantes (sin paginación)
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // Obtener estudiantes paginados
  getStudentsPaginated(page: number, size: number, sort?: string): Observable<PageResponse<Student>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PageResponse<Student>>(`${this.apiUrl}/paginated`, { params });
  }

  // Obtener estudiante por ID
  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  // Obtener estudiante por código
  getStudentByCode(code: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/code/${code}`);
  }

  // Crear estudiante
  createStudent(student: StudentCreateRequest): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  // Actualizar estudiante
  updateStudent(id: number, student: StudentUpdateRequest): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener estudiantes por carrera
  getStudentsByCareer(careerId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/career/${careerId}`);
  }

  // Obtener estudiantes por semestre
  getStudentsBySemester(semester: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/semester/${semester}`);
  }

  // Obtener estudiantes con deuda
  getStudentsWithDebt(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/with-debt`);
  }

  getByUserId(userId: number): Observable<Student> {
    return this.http.get<Student>(`${environment.apiUrl}/students/by-user/${userId}`);
  }

}