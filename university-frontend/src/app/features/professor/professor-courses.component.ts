import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CourseOfferingService } from '../../core/services/course-offering.service';
import { ProfessorService } from '../../core/services/professor.service';
import { AuthService } from '../../core/services/auth.service';
import { CourseOffering } from '../../core/models/course-offering.model';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-professor-courses',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, RouterModule ],
  template: `
    <div class="container">
      <h1><mat-icon>class</mat-icon> Mis Cursos</h1>
      
      <div class="courses-grid">
        @for (offering of offerings; track offering.id) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ offering.course.courseName }}</mat-card-title>
              <mat-card-subtitle>{{ offering.course.courseCode }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="info">
                <span>Período: {{ offering.academicPeriod.periodCode }}</span>
                <span>Matriculados: {{ offering.currentEnrollment }}/{{ offering.maxStudents }}</span>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button [routerLink]="['/professor/my-students']" [queryParams]="{offeringId: offering.id}">
                <mat-icon>groups</mat-icon> Ver Estudiantes
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    h1 { display: flex; align-items: center; gap: 12px; }
    .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; margin-top: 24px; }
    .info { display: flex; flex-direction: column; gap: 8px; }
  `]
})
export class ProfessorCoursesComponent implements OnInit {
  private offeringService = inject(CourseOfferingService);
  private professorService = inject(ProfessorService);
  private authService = inject(AuthService);

  offerings: CourseOffering[] = [];

  ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) return;

    this.professorService.getProfessorByUserId(userId).subscribe({
      next: (professor) => {
        this.offeringService.getOfferingsByProfessor(professor.id).subscribe({
          next: (offerings) => this.offerings = offerings,
          error: (err) => console.error(err)
        });
      }
    });
  }
}