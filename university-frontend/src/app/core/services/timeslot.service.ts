import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TimeSlot, Schedule } from '../models/timeslot.model';

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/time-slots`;

  getTimeSlotsByCourseOffering(courseOfferingId: number): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(`${this.apiUrl}/course-offering/${courseOfferingId}`);
  }

  getStudentSchedule(studentId: number, periodId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/student/${studentId}/period/${periodId}`);
  }

  getProfessorSchedule(professorId: number, periodId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/professor/${professorId}/period/${periodId}`);
  }

  deleteTimeSlot(timeSlotId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${timeSlotId}`);
  }
}