import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentService } from '../../core/services/student.service';
import { ProfessorService } from '../../core/services/professor.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { CourseOfferingService } from '../../core/services/course-offering.service';
import { DepartmentService } from '../../core/services/department.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>
          <mat-icon>analytics</mat-icon>
          Reportes y Estadísticas
        </h1>
        <p>Análisis y métricas del sistema académico</p>
      </div>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <!-- Estadísticas Generales -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <div class="stat-icon" style="background: #11998e;">
              <mat-icon>school</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ totalStudents }}</h3>
              <p>Estudiantes</p>
              <small>{{ activeStudents }} activos</small>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon" style="background: #ee0979;">
              <mat-icon>person</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ totalProfessors }}</h3>
              <p>Profesores</p>
              <small>{{ activeProfessors }} activos</small>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon" style="background: #667eea;">
              <mat-icon>book</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ totalCourses }}</h3>
              <p>Cursos</p>
              <small>{{ activeCourses }} activos</small>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon" style="background: #e91e63;">
              <mat-icon>class</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ totalOfferings }}</h3>
              <p>Ofertas</p>
              <small>{{ openOfferings }} abiertas</small>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon" style="background: #ff9800;">
              <mat-icon>assignment</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ totalEnrollments }}</h3>
              <p>Matrículas</p>
              <small>{{ activeEnrollments }} activas</small>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon" style="background: #9c27b0;">
              <mat-icon>business</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{ totalDepartments }}</h3>
              <p>Departamentos</p>
              <small>{{ activeDepartments }} activos</small>
            </div>
          </mat-card>
        </div>

        <!-- Estadísticas por Estado -->
        <div class="reports-section">
          <mat-card class="report-card">
            <h3>
              <mat-icon>school</mat-icon>
              Estudiantes por Estado
            </h3>
            <div class="report-list">
              @for (status of studentsByStatus; track status.label) {
                <div class="report-item">
                  <span class="label">{{ status.label }}</span>
                  <span class="value">{{ status.count }}</span>
                </div>
              }
            </div>
          </mat-card>

          <mat-card class="report-card">
            <h3>
              <mat-icon>assignment</mat-icon>
              Matrículas por Estado
            </h3>
            <div class="report-list">
              @for (status of enrollmentsByStatus; track status.label) {
                <div class="report-item">
                  <span class="label">{{ status.label }}</span>
                  <span class="value">{{ status.count }}</span>
                </div>
              }
            </div>
          </mat-card>

          <mat-card class="report-card">
            <h3>
              <mat-icon>class</mat-icon>
              Ofertas por Estado
            </h3>
            <div class="report-list">
              @for (status of offeringsByStatus; track status.label) {
                <div class="report-item">
                  <span class="label">{{ status.label }}</span>
                  <span class="value">{{ status.count }}</span>
                </div>
              }
            </div>
          </mat-card>
        </div>
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
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
        }
      }

      .stat-content {
        flex: 1;

        h3 {
          margin: 0 0 4px 0;
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        p {
          margin: 0 0 4px 0;
          font-size: 0.875rem;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 600;
        }

        small {
          font-size: 0.75rem;
          color: #95a5a6;
        }
      }
    }

    .reports-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .report-card {
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 20px 0;
        padding-bottom: 12px;
        border-bottom: 2px solid #f0f0f0;
        color: #2c3e50;
        font-size: 1.125rem;

        mat-icon {
          color: #ff9800;
        }
      }

      .report-list {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .report-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          transition: background 0.2s ease;

          &:hover {
            background: #e9ecef;
          }

          .label {
            font-size: 0.9375rem;
            color: #64748b;
          }

          .value {
            font-size: 1.125rem;
            font-weight: 700;
            color: #2c3e50;
          }
        }
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  private studentService = inject(StudentService);
  private professorService = inject(ProfessorService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private offeringService = inject(CourseOfferingService);
  private departmentService = inject(DepartmentService);

  loading = true;

  // Totales
  totalStudents = 0;
  activeStudents = 0;
  totalProfessors = 0;
  activeProfessors = 0;
  totalCourses = 0;
  activeCourses = 0;
  totalOfferings = 0;
  openOfferings = 0;
  totalEnrollments = 0;
  activeEnrollments = 0;
  totalDepartments = 0;
  activeDepartments = 0;

  // Por estado
  studentsByStatus: any[] = [];
  enrollmentsByStatus: any[] = [];
  offeringsByStatus: any[] = [];

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    forkJoin({
      students: this.studentService.getAllStudents(),
      professors: this.professorService.getAllProfessors(),
      courses: this.courseService.getAllCourses(),
      enrollments: this.enrollmentService.getAllEnrollments(),
      offerings: this.offeringService.getAllOfferings(),
      departments: this.departmentService.getAllDepartments()
    }).subscribe({
      next: (data) => {
        // Estudiantes
        this.totalStudents = data.students.length;
        this.activeStudents = data.students.filter(s => s.academicStatus === 'ACTIVO').length;
        this.studentsByStatus = [
          { label: 'Activos', count: data.students.filter(s => s.academicStatus === 'ACTIVO').length },
          { label: 'Inactivos', count: data.students.filter(s => s.academicStatus === 'INACTIVO').length },
          { label: 'Graduados', count: data.students.filter(s => s.academicStatus === 'GRADUADO').length },
          { label: 'Retirados', count: data.students.filter(s => s.academicStatus === 'RETIRADO').length }
        ];

        // Profesores
        this.totalProfessors = data.professors.length;
        this.activeProfessors = data.professors.filter(p => p.status === 'ACTIVO').length;

        // Cursos
        this.totalCourses = data.courses.length;
        this.activeCourses = data.courses.filter(c => c.status === 'ACTIVO').length;

        // Ofertas
        this.totalOfferings = data.offerings.length;
        this.openOfferings = data.offerings.filter(o => o.status === 'ABIERTO').length;
        this.offeringsByStatus = [
          { label: 'Abierto', count: data.offerings.filter(o => o.status === 'ABIERTO').length },
          { label: 'Cerrado', count: data.offerings.filter(o => o.status === 'CERRADO').length },
          { label: 'En Curso', count: data.offerings.filter(o => o.status === 'EN_CURSO').length },
          { label: 'Completado', count: data.offerings.filter(o => o.status === 'COMPLETADO').length },
          { label: 'Cancelado', count: data.offerings.filter(o => o.status === 'CANCELADO').length }
        ];

        // Matrículas
        this.totalEnrollments = data.enrollments.length;
        this.activeEnrollments = data.enrollments.filter(e => 
          e.status === 'MATRICULADO' || e.status === 'EN_CURSO'
        ).length;
        this.enrollmentsByStatus = [
          { label: 'Matriculado', count: data.enrollments.filter(e => e.status === 'MATRICULADO').length },
          { label: 'En Curso', count: data.enrollments.filter(e => e.status === 'EN_CURSO').length },
          { label: 'Completado', count: data.enrollments.filter(e => e.status === 'COMPLETADO').length },
          { label: 'Aprobado', count: data.enrollments.filter(e => e.status === 'APROBADO').length },
          { label: 'Reprobado', count: data.enrollments.filter(e => e.status === 'REPROBADO').length },
          { label: 'Retirado', count: data.enrollments.filter(e => e.status === 'RETIRADO').length }
        ];

        // Departamentos
        this.totalDepartments = data.departments.length;
        this.activeDepartments = data.departments.filter(d => d.status === 'ACTIVO').length;

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}