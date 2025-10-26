import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseOfferingService } from '../../core/services/course-offering.service';
import { ProfessorService } from '../../core/services/professor.service';
import { AuthService } from '../../core/services/auth.service';
import { CourseOffering } from '../../core/models/course-offering.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-professor-courses',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>
          <mat-icon>class</mat-icon>
          Mis Cursos
        </h1>
        <p>Gestiona tus cursos asignados</p>
      </div>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        @if (offerings.length === 0) {
          <div class="empty-state">
            <mat-icon>class</mat-icon>
            <h3>No tienes cursos asignados</h3>
            <p>Contacta al administrador para asignación de cursos</p>
          </div>
        } @else {
          <div class="courses-grid">
            @for (offering of offerings; track offering.id) {
              <mat-card class="course-card">
                <div class="card-header">
                  <div class="course-info">
                    <div class="course-code">{{ offering.course.courseCode }}</div>
                    <h3>{{ offering.course.courseName }}</h3>
                    <p class="period">{{ offering.academicPeriod.periodCode }}</p>
                  </div>
                  <mat-chip [color]="getStatusColor(offering.status)" highlighted>
                    {{ offering.status }}
                  </mat-chip>
                </div>

                <mat-card-content>
                  <div class="stats-grid">
                    <div class="stat-item">
                      <mat-icon>groups</mat-icon>
                      <div>
                        <span class="stat-value">{{ offering.currentEnrollment }}</span>
                        <span class="stat-label">Matriculados</span>
                      </div>
                    </div>

                    <div class="stat-item">
                      <mat-icon>event_seat</mat-icon>
                      <div>
                        <span class="stat-value">{{ offering.availableSeats }}</span>
                        <span class="stat-label">Disponibles</span>
                      </div>
                    </div>

                    <div class="stat-item">
                      <mat-icon>schedule</mat-icon>
                      <div>
                        <span class="stat-value">{{ offering.totalWeeklyHours }}h</span>
                        <span class="stat-label">Semanales</span>
                      </div>
                    </div>

                    <div class="stat-item">
                      <mat-icon>grade</mat-icon>
                      <div>
                        <span class="stat-value">{{ offering.course.credits }}</span>
                        <span class="stat-label">Créditos</span>
                      </div>
                    </div>
                  </div>

                  <div class="progress-container">
                    <div class="progress-info">
                      <span>Ocupación</span>
                      <strong>{{ getOccupancyPercentage(offering) }}%</strong>
                    </div>
                    <div class="progress-bar">
                      <div class="progress" [style.width.%]="getOccupancyPercentage(offering)"></div>
                    </div>
                  </div>
                </mat-card-content>

                <mat-card-actions>
                  <button mat-raised-button color="primary" 
                          [routerLink]="['/professor/my-students']" 
                          [queryParams]="{offeringId: offering.id}">
                    <mat-icon>groups</mat-icon>
                    Ver Estudiantes
                  </button>
                  <button mat-stroked-button 
                          [routerLink]="['/professor/grades']" 
                          [queryParams]="{offeringId: offering.id}">
                    <mat-icon>grade</mat-icon>
                    Calificar
                  </button>
                </mat-card-actions>
              </mat-card>
            }
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
          color: #ee0979;
        }
      }

      p {
        margin: 0;
        color: #7f8c8d;
        font-size: 1rem;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 64px;
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

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .course-card {
      transition: all 0.3s ease;
      border-top: 4px solid #ee0979;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;

        .course-info {
          flex: 1;

          .course-code {
            display: inline-block;
            padding: 4px 12px;
            background: #f0f0f0;
            border-radius: 6px;
            font-size: 0.8125rem;
            font-weight: 600;
            color: #64748b;
            margin-bottom: 8px;
          }

          h3 {
            margin: 0 0 6px 0;
            font-size: 1.25rem;
            color: #2c3e50;
            font-weight: 600;
          }

          .period {
            margin: 0;
            font-size: 0.875rem;
            color: #7f8c8d;
          }
        }
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 20px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;

          mat-icon {
            color: #ee0979;
            font-size: 24px;
            width: 24px;
            height: 24px;
          }

          div {
            display: flex;
            flex-direction: column;
            gap: 2px;

            .stat-value {
              font-size: 1.25rem;
              font-weight: 700;
              color: #2c3e50;
            }

            .stat-label {
              font-size: 0.75rem;
              color: #7f8c8d;
              text-transform: uppercase;
              font-weight: 600;
            }
          }
        }
      }

      .progress-container {
        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.875rem;

          span {
            color: #64748b;
          }

          strong {
            color: #2c3e50;
          }
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;

          .progress {
            height: 100%;
            background: linear-gradient(90deg, #ee0979 0%, #ff6a00 100%);
            transition: width 0.3s ease;
          }
        }
      }

      mat-card-actions {
        padding: 16px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        gap: 12px;

        button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
      }
    }

    @media (max-width: 768px) {
      .courses-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class ProfessorCoursesComponent implements OnInit {
  private offeringService = inject(CourseOfferingService);
  private professorService = inject(ProfessorService);
  private authService = inject(AuthService);

  offerings: CourseOffering[] = [];
  loading = false;

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

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'ABIERTO': 'primary',
      'CERRADO': 'warn',
      'EN_CURSO': 'accent',
      'COMPLETADO': 'accent'
    };
    return colors[status] || 'primary';
  }

  getOccupancyPercentage(offering: CourseOffering): number {
    if (offering.maxStudents === 0) return 0;
    return Math.round((offering.currentEnrollment / offering.maxStudents) * 100);
  }
}