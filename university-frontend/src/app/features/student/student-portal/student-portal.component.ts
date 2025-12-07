
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Student } from '../../../core/models/student.model';
import { Enrollment } from '../../../core/models/enrollment.model';

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  template: `
    <div class="portal-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          @if (student) {
            <div class="welcome-card">
              <div class="profile-avatar">
                {{ getInitials(student.user.firstName, student.user.lastName) }}
              </div>
              <div class="welcome-text">
                <h1>¡Hola, {{ student.user.firstName }}!</h1>
                <p>Bienvenido a tu Portal Estudiantil</p>
                <div class="student-info-chips">
                  <div class="info-chip">
                    <mat-icon>school</mat-icon>
                    <span>{{ student.career.careerName }}</span>
                  </div>
                  <div class="info-chip">
                    <mat-icon>event_note</mat-icon>
                    <span>Semestre {{ student.currentSemester }}</span>
                  </div>
                  <div class="info-chip">
                    <mat-icon>badge</mat-icon>
                    <span>{{ student.studentCode }}</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Quick Stats -->
      @if (!loading) {
        <div class="stats-grid">
          <mat-card class="stat-card" routerLink="/enrollments/my-enrollments">
            <div class="stat-icon active">
              <mat-icon>class</mat-icon>
            </div>
            <div class="stat-details">
              <span class="stat-value">{{ activeEnrollments }}</span>
              <span class="stat-label">Cursos Activos</span>
            </div>
          </mat-card>

          <mat-card class="stat-card" routerLink="/grades">
            <div class="stat-icon approved">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-details">
              <span class="stat-value">{{ approvedCourses }}</span>
              <span class="stat-label">Aprobados</span>
            </div>
          </mat-card>

          <mat-card class="stat-card" routerLink="/schedule">
            <div class="stat-icon schedule">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="stat-details">
              <span class="stat-value">{{ weeklyHours }}</span>
              <span class="stat-label">Horas/Semana</span>
            </div>
          </mat-card>

          <mat-card class="stat-card" routerLink="/offerings">
            <div class="stat-icon credits">
              <mat-icon>stars</mat-icon>
            </div>
            <div class="stat-details">
              <span class="stat-value">{{ student?.totalCredits || 0 }}</span>
              <span class="stat-label">Créditos</span>
            </div>
          </mat-card>
        </div>
      }

      <!-- Quick Actions Grid -->
      <div class="actions-section">
        <h2>
          <mat-icon>apps</mat-icon>
          Acciones Rápidas
        </h2>
        <div class="actions-grid">
          <!-- Matrícula -->
          <mat-card class="action-card" routerLink="/offerings">
            <div class="action-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <mat-icon>how_to_reg</mat-icon>
            </div>
            <h3>Matrícula</h3>
            <p>Inscríbete en cursos disponibles</p>
            <button mat-button color="primary">
              <span>Ver Ofertas</span>
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card>

          <!-- Mis Cursos -->
          <mat-card class="action-card" routerLink="/enrollments/my-enrollments">
            <div class="action-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              <mat-icon>class</mat-icon>
            </div>
            <h3>Mis Cursos</h3>
            <p>Revisa tus cursos matriculados</p>
            <button mat-button color="primary">
              <span>Ver Cursos</span>
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card>

          <!-- Horario -->
          <mat-card class="action-card" routerLink="/schedule">
            <div class="action-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <mat-icon>calendar_view_week</mat-icon>
            </div>
            <h3>Mi Horario</h3>
            <p>Consulta tu horario semanal</p>
            <button mat-button color="primary">
              <span>Ver Horario</span>
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card>

          <!-- Calificaciones -->
          <mat-card class="action-card" routerLink="/grades">
            <div class="action-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
              <mat-icon>grade</mat-icon>
            </div>
            <h3>Calificaciones</h3>
            <p>Revisa tus notas y promedios</p>
            <button mat-button color="primary">
              <span>Ver Notas</span>
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card>

          <!-- Mensajes -->
          <mat-card class="action-card" routerLink="/student/messages">
            <div class="action-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
              <mat-icon [matBadge]="unreadMessages" matBadgeColor="warn" [matBadgeHidden]="unreadMessages === 0">
                mail
              </mat-icon>
            </div>
            <h3>Mensajes</h3>
            <p>Comunicación con profesores</p>
            <button mat-button color="primary">
              <span>Abrir Mensajes</span>
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card>

          <!-- Perfil -->
          <mat-card class="action-card" routerLink="/student/profile">
            <div class="action-icon" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)">
              <mat-icon>account_circle</mat-icon>
            </div>
            <h3>Mi Perfil</h3>
            <p>Actualiza tu información</p>
            <button mat-button color="primary">
              <span>Ver Perfil</span>
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card>
        </div>
      </div>

      <!-- Current Enrollments Preview -->
      @if (currentEnrollments.length > 0) {
        <div class="enrollments-section">
          <div class="section-header">
            <h2>
              <mat-icon>class</mat-icon>
              Cursos en Progreso
            </h2>
            <button mat-button color="primary" routerLink="/enrollments/my-enrollments">
              Ver Todos
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
          <div class="enrollments-grid">
            @for (enrollment of currentEnrollments.slice(0, 3); track enrollment.id) {
              <mat-card class="enrollment-card">
                <div class="course-badge">{{ enrollment.courseOffering.courseCode }}</div>
                <h3>{{ enrollment.courseOffering.courseName }}</h3>
                <div class="course-info">
                  <div class="info-item">
                    <mat-icon>person</mat-icon>
                    <span>{{ enrollment.courseOffering.professorName }}</span>
                  </div>
                  <div class="info-item">
                    <mat-icon>event</mat-icon>
                    <span>{{ enrollment.courseOffering.periodCode }}</span>
                  </div>
                </div>
                <div class="course-status">
                  <mat-icon [style.color]="getStatusColor(enrollment.status)">
                    {{ getStatusIcon(enrollment.status) }}
                  </mat-icon>
                  <span>{{ enrollment.status }}</span>
                </div>
              </mat-card>
            }
          </div>
        </div>
      }

      <!-- Loading State -->
      @if (loading) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Cargando tu información...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .portal-container {
      min-height: 100vh;
      background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
    }

    // Hero Section
    .hero-section {
      position: relative;
      height: 350px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
        background-size: cover;
      }

      .hero-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
      }

      .hero-content {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 24px;
      }
    }

    .welcome-card {
      display: flex;
      align-items: center;
      gap: 32px;
      animation: fadeInUp 0.8s ease;

      .profile-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: 700;
        color: white;
        border: 4px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      }

      .welcome-text {
        color: white;

        h1 {
          margin: 0 0 8px 0;
          font-size: 3rem;
          font-weight: 700;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
        }

        p {
          margin: 0 0 20px 0;
          font-size: 1.25rem;
          opacity: 0.95;
        }

        .student-info-chips {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;

          .info-chip {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            font-size: 0.9375rem;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.2);

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }

    // Stats Grid
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      padding: 24px;
      max-width: 1400px;
      margin: -80px auto 0;
      position: relative;
      z-index: 1;

      .stat-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 24px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

        &:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
            color: white;
          }

          &.active { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          &.approved { background: linear-gradient(135deg, #4caf50 0%, #81c784 100%); }
          &.schedule { background: linear-gradient(135deg, #2196f3 0%, #64b5f6 100%); }
          &.credits { background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%); }
        }

        .stat-details {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2c3e50;
            line-height: 1;
          }

          .stat-label {
            font-size: 0.875rem;
            color: #64748b;
            font-weight: 500;
          }
        }
      }
    }

    // Actions Section
    .actions-section {
      padding: 40px 24px;
      max-width: 1400px;
      margin: 0 auto;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 24px 0;
        color: #2c3e50;
        font-size: 1.75rem;

        mat-icon {
          color: #667eea;
        }
      }
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;

      .action-card {
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);

          .action-icon {
            transform: scale(1.1) rotate(5deg);
          }
        }

        .action-icon {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

          mat-icon {
            font-size: 36px;
            width: 36px;
            height: 36px;
            color: white;
          }
        }

        h3 {
          margin: 0 0 8px 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c3e50;
          text-align: center;
        }

        p {
          margin: 0 0 16px 0;
          color: #64748b;
          font-size: 0.9375rem;
          text-align: center;
          min-height: 40px;
        }

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          font-weight: 600;
        }
      }
    }

    // Enrollments Section
    .enrollments-section {
      padding: 40px 24px;
      max-width: 1400px;
      margin: 0 auto;

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        h2 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          color: #2c3e50;
          font-size: 1.75rem;

          mat-icon {
            color: #667eea;
          }
        }

        button {
          display: flex;
          align-items: center;
          gap: 6px;
        }
      }
    }

    .enrollments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;

      .enrollment-card {
        position: relative;
        padding: 24px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .course-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        h3 {
          margin: 0 0 16px 0;
          color: #2c3e50;
          font-size: 1.125rem;
          padding-right: 80px;
        }

        .course-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;

          .info-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #64748b;
            font-size: 0.875rem;

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
            }
          }
        }

        .course-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f8f9fa;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.875rem;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }
      }
    }

    // Loading
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 20px;

      p {
        color: #64748b;
        font-size: 1rem;
      }
    }

    // Animations
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    // Responsive
    @media (max-width: 768px) {
      .hero-section {
        height: auto;
        min-height: 300px;
      }

      .welcome-card {
        flex-direction: column;
        text-align: center;

        .profile-avatar {
          width: 100px;
          height: 100px;
          font-size: 2.5rem;
        }

        .welcome-text h1 {
          font-size: 2rem;
        }

        .student-info-chips {
          justify-content: center;
        }
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        margin-top: -60px;
        gap: 12px;
        padding: 16px;
      }

      .actions-grid,
      .enrollments-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StudentPortalComponent implements OnInit {
  private authService = inject(AuthService);
  private studentService = inject(StudentService);
  private enrollmentService = inject(EnrollmentService);

  student: Student | null = null;
  currentEnrollments: Enrollment[] = [];
  loading = true;

  // Stats
  activeEnrollments = 0;
  approvedCourses = 0;
  weeklyHours = 0;
  unreadMessages = 0; // Implementar con WebSocket

  ngOnInit(): void {
    this.loadStudentData();
  }

  loadStudentData(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.loading = false;
      return;
    }

    this.studentService.getByUserId(userId).subscribe({
      next: (student) => {
        this.student = student;
        this.loadEnrollments(student.id);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadEnrollments(studentId: number): void {
    this.enrollmentService.getEnrollmentsByStudent(studentId).subscribe({
      next: (enrollments) => {
        this.currentEnrollments = enrollments.filter(e => 
          e.status === 'MATRICULADO' || e.status === 'EN_CURSO'
        );
        this.calculateStats(enrollments);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  calculateStats(enrollments: Enrollment[]): void {
    this.activeEnrollments = enrollments.filter(e => 
      e.status === 'MATRICULADO' || e.status === 'EN_CURSO'
    ).length;

    this.approvedCourses = enrollments.filter(e => 
      e.status === 'APROBADO'
    ).length;

    // Calcular horas semanales (simulado - implementar con TimeSlot)
    this.weeklyHours = this.activeEnrollments * 4; // Promedio de 4h por curso
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'MATRICULADO': '#2196f3',
      'EN_CURSO': '#ff9800',
      'COMPLETADO': '#4caf50',
      'APROBADO': '#4caf50',
      'REPROBADO': '#f44336',
      'RETIRADO': '#9e9e9e'
    };
    return colors[status] || '#64748b';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'MATRICULADO': 'pending',
      'EN_CURSO': 'play_circle',
      'COMPLETADO': 'check_circle',
      'APROBADO': 'check_circle',
      'REPROBADO': 'cancel',
      'RETIRADO': 'remove_circle'
    };
    return icons[status] || 'info';
  }
}