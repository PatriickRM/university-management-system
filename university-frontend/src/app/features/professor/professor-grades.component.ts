import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

import { EnrollmentService } from '../../core/services/enrollment.service';
import { CourseOfferingService } from '../../core/services/course-offering.service';
import { ProfessorService } from '../../core/services/professor.service';
import { AuthService } from '../../core/services/auth.service';
import { Enrollment } from '../../core/models/enrollment.model';
import { CourseOffering } from '../../core/models/course-offering.model';

@Component({
  selector: 'app-professor-grades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>
          <mat-icon>grade</mat-icon>
          Asignar Calificaciones
        </h1>
        <p>Registra las notas finales de tus estudiantes</p>
      </div>

      <mat-card class="filter-card">
        <mat-form-field appearance="outline">
          <mat-label>Seleccionar Curso</mat-label>
          <mat-select [(ngModel)]="selectedOfferingId" (ngModelChange)="loadEnrollments()">
            @for (offering of offerings; track offering.id) {
              <mat-option [value]="offering.id">
                {{ offering.course.courseCode }} - {{ offering.course.courseName }} ({{ offering.academicPeriod.periodCode }})
              </mat-option>
            }
          </mat-select>
          <mat-icon matPrefix>class</mat-icon>
        </mat-form-field>
      </mat-card>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        @if (selectedOfferingId && enrollments.length > 0) {
          <mat-card class="grades-card">
            <div class="grades-header">
              <h3>
                <mat-icon>list</mat-icon>
                Lista de Estudiantes
              </h3>
              <span class="info">Total: <strong>{{ enrollments.length }}</strong></span>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="enrollments">
                
                <ng-container matColumnDef="studentCode">
                  <th mat-header-cell *matHeaderCellDef>Código</th>
                  <td mat-cell *matCellDef="let e"><strong>{{ e.student.studentCode }}</strong></td>
                </ng-container>

                <ng-container matColumnDef="fullName">
                  <th mat-header-cell *matHeaderCellDef>Estudiante</th>
                  <td mat-cell *matCellDef="let e">{{ e.student.fullName }}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let e">{{ e.status }}</td>
                </ng-container>

                <ng-container matColumnDef="currentGrade">
                  <th mat-header-cell *matHeaderCellDef>Nota Actual</th>
                  <td mat-cell *matCellDef="let e">
                    @if (e.finalGrade !== null && e.finalGrade !== undefined) {
                      <div class="grade" [class.approved]="e.finalGrade >= 10.5">
                        {{ e.finalGrade }}
                      </div>
                    } @else {
                      <span class="no-grade">--</span>
                    }
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let e">
                    @if (e.status === 'COMPLETADO' || e.status === 'EN_CURSO') {
                      <button mat-raised-button color="primary" (click)="openGradeDialog(e)">
                        <mat-icon>edit</mat-icon>
                        {{ e.finalGrade ? 'Editar' : 'Calificar' }}
                      </button>
                    } @else {
                      <span class="not-available">No disponible</span>
                    }
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </mat-card>
        } @else if (selectedOfferingId) {
          <div class="empty-state">
            <mat-icon>groups</mat-icon>
            <h3>No hay estudiantes</h3>
            <p>Este curso no tiene estudiantes matriculados</p>
          </div>
        } @else {
          <div class="select-prompt">
            <mat-icon>arrow_upward</mat-icon>
            <h3>Selecciona un curso</h3>
            <p>Elige un curso del menú superior para calificar</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;

      h1 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 8px 0;
        color: #2c3e50;
        font-size: 2rem;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #ff9800;
        }
      }

      p {
        margin: 0;
        color: #7f8c8d;
      }
    }

    .filter-card {
      margin-bottom: 24px;
      padding: 20px;

      mat-form-field {
        width: 100%;
        max-width: 600px;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    .grades-card {
      .grades-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e0e0e0;

        h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          color: #2c3e50;

          mat-icon {
            color: #ff9800;
          }
        }

        .info {
          color: #64748b;

          strong {
            color: #2c3e50;
            font-size: 1.25rem;
          }
        }
      }

      .table-container {
        overflow-x: auto;
      }
    }

    table {
      width: 100%;

      th {
        background: #f5f7fa;
        color: #2c3e50;
        font-weight: 600;
        padding: 16px;
      }

      td {
        padding: 16px;
      }

      .grade {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 50px;
        padding: 6px 12px;
        border-radius: 8px;
        font-weight: 700;
        background: #f44336;
        color: white;

        &.approved {
          background: #4caf50;
        }
      }

      .no-grade {
        color: #bdc3c7;
        font-size: 1.5rem;
      }

      .not-available {
        color: #bdc3c7;
        font-size: 0.875rem;
      }
    }

    .empty-state,
    .select-prompt {
      text-align: center;
      padding: 64px 24px;
      color: #7f8c8d;

      mat-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        margin-bottom: 16px;
        opacity: 0.3;
      }

      h3 {
        margin: 0 0 8px 0;
        font-size: 1.5rem;
        color: #2c3e50;
      }
    }
  `]
})
export class ProfessorGradesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private enrollmentService = inject(EnrollmentService);
  private offeringService = inject(CourseOfferingService);
  private professorService = inject(ProfessorService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  offerings: CourseOffering[] = [];
  enrollments: Enrollment[] = [];
  selectedOfferingId: number | null = null;
  loading = false;
  displayedColumns = ['studentCode', 'fullName', 'status', 'currentGrade', 'actions'];

  ngOnInit(): void {
    this.loading = true;
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.loading = false;
      return;
    }

    this.professorService.getProfessorByUserId(userId).subscribe({
      next: (professor) => {
        this.offeringService.getOfferingsByProfessor(professor.id).subscribe({
          next: (offerings) => {
            this.offerings = offerings;
            
            const offeringId = this.route.snapshot.queryParams['offeringId'];
            if (offeringId) {
              this.selectedOfferingId = +offeringId;
              this.loadEnrollments();
            } else {
              this.loading = false;
            }
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadEnrollments(): void {
    if (!this.selectedOfferingId) return;

    this.loading = true;
    this.enrollmentService.getEnrollmentsByCourseOffering(this.selectedOfferingId).subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  openGradeDialog(enrollment: Enrollment): void {
    import('../enrollment/grade-dialog/grade-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.GradeDialogComponent, {
        width: '500px',
        data: { enrollment }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadEnrollments();
          this.snackBar.open('Calificación registrada', 'Cerrar', { duration: 3000 });
        }
      });
    });
  }
}