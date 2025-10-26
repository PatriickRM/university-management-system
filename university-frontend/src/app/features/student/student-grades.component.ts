import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EnrollmentService } from '../../core/services/enrollment.service';
import { StudentService } from '../../core/services/student.service';
import { AuthService } from '../../core/services/auth.service';
import { Enrollment } from '../../core/models/enrollment.model';

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>
          <mat-icon>grade</mat-icon>
          Mis Calificaciones
        </h1>
        <p>Consulta tus notas finales</p>
      </div>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <!-- Stats Cards -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <div class="stat-icon" style="background: #4caf50">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-label">Cursos Aprobados</span>
              <span class="stat-value">{{ approvedCount }}</span>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon" style="background: #f44336">
              <mat-icon>cancel</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-label">Cursos Reprobados</span>
              <span class="stat-value">{{ failedCount }}</span>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon" style="background: #ff9800">
              <mat-icon>trending_up</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-label">Promedio General</span>
              <span class="stat-value">{{ calculateAverage() }}</span>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon" style="background: #2196f3">
              <mat-icon>assessment</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-label">Total Cursos</span>
              <span class="stat-value">{{ enrollments.length }}</span>
            </div>
          </mat-card>
        </div>

        <!-- Grades Table -->
        @if (enrollments.length > 0) {
          <mat-card class="grades-card">
            <div class="card-header">
              <h3>
                <mat-icon>list</mat-icon>
                Historial de Calificaciones
              </h3>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="enrollments">
                
                <ng-container matColumnDef="period">
                  <th mat-header-cell *matHeaderCellDef>Período</th>
                  <td mat-cell *matCellDef="let e">
                    <mat-chip>{{ e.courseOffering.periodCode }}</mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="courseCode">
                  <th mat-header-cell *matHeaderCellDef>Código</th>
                  <td mat-cell *matCellDef="let e">
                    <strong>{{ e.courseOffering.courseCode }}</strong>
                  </td>
                </ng-container>

                <ng-container matColumnDef="courseName">
                  <th mat-header-cell *matHeaderCellDef>Curso</th>
                  <td mat-cell *matCellDef="let e">{{ e.courseOffering.courseName }}</td>
                </ng-container>

                <ng-container matColumnDef="professor">
                  <th mat-header-cell *matHeaderCellDef>Profesor</th>
                  <td mat-cell *matCellDef="let e">{{ e.courseOffering.professorName }}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let e">
                    <mat-chip [color]="getStatusColor(e.status)" highlighted>
                      {{ e.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="grade">
                  <th mat-header-cell *matHeaderCellDef>Nota Final</th>
                  <td mat-cell *matCellDef="let e">
                    @if (e.finalGrade !== null && e.finalGrade !== undefined) {
                      <div class="grade" [class.approved]="e.finalGrade >= 10.5">
                        {{ e.finalGrade }}
                      </div>
                    } @else {
                      <span class="pending-grade">--</span>
                    }
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
              </table>
            </div>
          </mat-card>
        } @else {
          <div class="empty-state">
            <mat-icon>grade</mat-icon>
            <h3>No hay calificaciones</h3>
            <p>Aún no tienes cursos con calificaciones registradas</p>
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
      margin-bottom: 32px;

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

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          color: white;
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }

      .stat-content {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }
      }
    }

    .grades-card {
      .card-header {
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

      .table-row {
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #f8f9fa;
        }
      }

      .grade {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 60px;
        padding: 8px 16px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 1.125rem;
        background: #f44336;
        color: white;
        box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);

        &.approved {
          background: #4caf50;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        }
      }

      .pending-grade {
        color: #bdc3c7;
        font-size: 1.5rem;
        font-weight: 300;
      }
    }

    .empty-state {
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

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      table {
        .mat-column-professor {
          display: none;
        }
      }
    }
  `]
})
export class StudentGradesComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);
  private authService = inject(AuthService);

  enrollments: Enrollment[] = [];
  loading = false;
  displayedColumns = ['period', 'courseCode', 'courseName', 'professor', 'status', 'grade'];

  approvedCount = 0;
  failedCount = 0;

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.loading = true;
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.loading = false;
      return;
    }

    this.studentService.getByUserId(userId).subscribe({
      next: (student) => {
        this.enrollmentService.getEnrollmentsByStudent(student.id).subscribe({
          next: (enrollments) => {
            this.enrollments = enrollments.sort((a, b) => 
              new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime()
            );
            this.calculateStats();
            this.loading = false;
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

  calculateStats(): void {
    this.approvedCount = this.enrollments.filter(e => e.status === 'APROBADO').length;
    this.failedCount = this.enrollments.filter(e => e.status === 'REPROBADO').length;
  }

  calculateAverage(): string {
    const graded = this.enrollments.filter(e => 
      e.finalGrade !== null && e.finalGrade !== undefined
    );
    
    if (graded.length === 0) return '--';

    const sum = graded.reduce((acc, e) => acc + (e.finalGrade || 0), 0);
    const avg = sum / graded.length;
    return avg.toFixed(2);
  }
    
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'ABIERTO': 'primary',
      'CERRADO': 'warn',
      'EN_CURSO': 'accent',
      'COMPLETADO': 'accent'
    };
    return colors[status] || 'primary';
  }
}