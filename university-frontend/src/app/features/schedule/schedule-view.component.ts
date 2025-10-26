// university-frontend/src/app/features/schedule/schedule-view.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { TimeSlotService } from '../../core/services/timeslot.service';
import { AuthService } from '../../core/services/auth.service';
import { Schedule, DayOfWeek } from '../../core/models/timeslot.model';
import { StudentService } from '../../core/services/student.service';
import { ProfessorService } from '../../core/services/professor.service';
import { AcademicPeriodService } from '../../core/services/academic-period.service';

@Component({
  selector: 'app-schedule-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss']
})
export class ScheduleViewComponent implements OnInit {
  private timeSlotService = inject(TimeSlotService);
  private authService = inject(AuthService);
  private studentService = inject(StudentService);      
  private professorService = inject(ProfessorService);  
  private periodService = inject(AcademicPeriodService);

  schedules: Schedule[] = [];
  loading = false;
  
  daysOfWeek: DayOfWeek[] = [
    DayOfWeek.LUNES,
    DayOfWeek.MARTES,
    DayOfWeek.MIERCOLES,
    DayOfWeek.JUEVES,
    DayOfWeek.VIERNES,
    DayOfWeek.SABADO
  ];

  ngOnInit(): void {
    this.loadSchedule();
  }

  loadSchedule(): void {
    this.loading = true;
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.loading = false;
      return;
    }

    if (this.authService.hasRole('STUDENT')) {
      const userId = this.authService.getUserIdFromToken();
      if (!userId) {
        this.loading = false;
        return;
      }

      // Obtener el estudiante y período activo
      this.studentService.getByUserId(userId).subscribe({
        next: (student) => {
          this.periodService.getActivePeriod().subscribe({
            next: (period) => {
              // Ahora sí cargar el horario
              this.timeSlotService.getStudentSchedule(student.id, period.id).subscribe({
                next: (schedules) => {
                  this.schedules = schedules;
                  this.loading = false;
                },
                error: (err) => {
                  console.error(err);
                  this.loading = false;
                }
              });
            },
            error: (err) => {
              console.error('Error loading period:', err);
              this.loading = false;
            }
          });
        },
        error: (err) => {
          console.error('Error loading student:', err);
          this.loading = false;
        }
      });
    } else if (this.authService.hasRole('PROFESSOR')) {
      const userId = this.authService.getUserIdFromToken();
      if (!userId) {
        this.loading = false;
        return;
      }

      // Obtener el profesor y período activo
      this.professorService.getProfessorByUserId(userId).subscribe({
        next: (professor) => {
          this.periodService.getActivePeriod().subscribe({
            next: (period) => {
              this.timeSlotService.getProfessorSchedule(professor.id, period.id).subscribe({
                next: (schedules) => {
                  this.schedules = schedules;
                  this.loading = false;
                },
                error: (err) => {
                  console.error(err);
                  this.loading = false;
                }
              });
            },
            error: (err) => {
              console.error('Error loading period:', err);
              this.loading = false;
            }
          });
        },
        error: (err) => {
          console.error('Error loading professor:', err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  getDayLabel(day: DayOfWeek): string {
    const labels: Record<DayOfWeek, string> = {
      [DayOfWeek.LUNES]: 'Lunes',
      [DayOfWeek.MARTES]: 'Martes',
      [DayOfWeek.MIERCOLES]: 'Miércoles',
      [DayOfWeek.JUEVES]: 'Jueves',
      [DayOfWeek.VIERNES]: 'Viernes',
      [DayOfWeek.SABADO]: 'Sábado'
    };
    return labels[day];
  }

  getScheduleForDay(day: DayOfWeek): Schedule[] {
    return this.schedules.filter(schedule => 
      schedule.timeSlots.some(slot => slot.dayOfWeek === day)
    );
  }

  getTimeSlotForDay(schedule: Schedule, day: DayOfWeek): string {
    const slot = schedule.timeSlots.find(s => s.dayOfWeek === day);
    if (!slot) return '';
    
    return `${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(0, 5)}`;
  }

  getClassroomForDay(schedule: Schedule, day: DayOfWeek): string {
    const slot = schedule.timeSlots.find(s => s.dayOfWeek === day);
    return slot?.classroom || '';
  }

  getTotalWeeklyHours(): number {
    return this.schedules.reduce((total, schedule) => 
      total + (schedule.totalWeeklyHours || 0), 0
    );
  }

  getTotalCredits(): number {
    return this.schedules.reduce((total, schedule) => 
      total + schedule.credits, 0
    );
  }
}