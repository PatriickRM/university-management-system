import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { CourseOfferingService } from '../../core/services/course-offering.service';
import { ProfessorService } from '../../core/services/professor.service';
import { AuthService } from '../../core/services/auth.service';
import { Enrollment } from '../../core/models/enrollment.model';
import { CourseOffering } from '../../core/models/course-offering.model';

@Component({
  selector: 'app-professor-students',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatCardModule, 
    MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule
  ],
  template: `
    <div class="container">
      <h1><mat-icon>groups</mat-icon> Mis Estudiantes</h1>
      
      <mat-card>
        <mat-form-field appearance="outline">
          <mat-label>Seleccionar Curso</mat-label>
          <mat-select [(ngModel)]="selectedOfferingId" (ngModelChange)="loadStudents()">
            @for (offering of offerings; track offering.id) {
              <mat-option [value]="offering.id">
                {{ offering.course.courseName }} - {{ offering.academicPeriod.periodCode }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
      </mat-card>

      @if (selectedOfferingId) {
        <mat-card>
          <table mat-table [dataSource]="enrollments">
            <ng-container matColumnDef="studentCode">
              <th mat-header-cell *matHeaderCellDef>Código</th>
              <td mat-cell *matCellDef="let e">{{ e.student.studentCode }}</td>
            </ng-container>

            <ng-container matColumnDef="fullName">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let e">{{ e.student.fullName }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let e">{{ e.status }}</td>
            </ng-container>

            <ng-container matColumnDef="grade">
              <th mat-header-cell *matHeaderCellDef>Nota</th>
              <td mat-cell *matCellDef="let e">{{ e.finalGrade || '-' }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    h1 { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    mat-card { margin-bottom: 24px; }
    table { width: 100%; }
  `]
})
export class ProfessorStudentsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private enrollmentService = inject(EnrollmentService);
  private offeringService = inject(CourseOfferingService);
  private professorService = inject(ProfessorService);
  private authService = inject(AuthService);

  offerings: CourseOffering[] = [];
  enrollments: Enrollment[] = [];
  selectedOfferingId: number | null = null;
  displayedColumns = ['studentCode', 'fullName', 'status', 'grade'];

  ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) return;

    this.professorService.getProfessorByUserId(userId).subscribe({
      next: (professor) => {
        this.offeringService.getOfferingsByProfessor(professor.id).subscribe({
          next: (offerings) => {
            this.offerings = offerings;
            
            const offeringId = this.route.snapshot.queryParams['offeringId'];
            if (offeringId) {
              this.selectedOfferingId = +offeringId;
              this.loadStudents();
            }
          }
        });
      }
    });
  }

  loadStudents(): void {
    if (!this.selectedOfferingId) return;

    this.enrollmentService.getEnrollmentsByCourseOffering(this.selectedOfferingId).subscribe({
      next: (enrollments) => this.enrollments = enrollments,
      error: (err) => console.error(err)
    });
  }
}