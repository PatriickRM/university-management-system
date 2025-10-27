import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { StudentService } from '../../core/services/student.service';
import { ProfessorService } from '../../core/services/professor.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { CourseOfferingService } from '../../core/services/course-offering.service';
import { forkJoin } from 'rxjs';

interface DashboardCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  route: string;
}

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private studentService = inject(StudentService);
  private professorService = inject(ProfessorService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private offeringService = inject(CourseOfferingService);

  currentUser$ = this.authService.currentUser$;
  userRole = '';
  dashboardTitle = '';
  dashboardSubtitle = '';
  
  stats: StatCard[] = [];
  cards: DashboardCard[] = [];
  loading = true;

  ngOnInit(): void {
    this.setUserRole();
    this.loadDashboardData();
  }

  setUserRole(): void {
    if (this.authService.hasRole('ADMIN')) {
      this.userRole = 'admin';
      this.dashboardTitle = 'Panel de Administración';
      this.dashboardSubtitle = 'Gestiona el sistema académico universitario';
    } else if (this.authService.hasRole('PROFESSOR')) {
      this.userRole = 'professor';
      this.dashboardTitle = 'Portal del Profesor';
      this.dashboardSubtitle = 'Gestiona tus cursos y estudiantes';
    } else if (this.authService.hasRole('STUDENT')) {
      this.userRole = 'student';
      this.dashboardTitle = 'Portal del Estudiante';
      this.dashboardSubtitle = 'Accede a tus cursos y calificaciones';
    }
  }

  loadDashboardData(): void {
    this.loading = true;

    if (this.authService.hasRole('ADMIN')) {
      this.loadAdminDashboard();
    } else if (this.authService.hasRole('PROFESSOR')) {
      this.loadProfessorDashboard();
    } else if (this.authService.hasRole('STUDENT')) {
      this.loadStudentDashboard();
    }
  }

  loadAdminDashboard(): void {
    forkJoin({
      students: this.studentService.getAllStudents(),
      professors: this.professorService.getAllProfessors(),
      courses: this.courseService.getAllCourses(),
      enrollments: this.enrollmentService.getAllEnrollments(),
      offerings: this.offeringService.getAllOfferings()
    }).subscribe({
      next: (data) => {
        // Stats
        this.stats = [
          {
            label: 'Total Estudiantes',
            value: data.students.length,
            icon: 'school',
            color: '#11998e'
          },
          {
            label: 'Total Profesores',
            value: data.professors.length,
            icon: 'person',
            color: '#ee0979'
          },
          {
            label: 'Cursos Activos',
            value: data.courses.filter(c => c.status === 'ACTIVO').length,
            icon: 'book',
            color: '#667eea'
          },
          {
            label: 'Matrículas Activas',
            value: data.enrollments.filter(e => 
              e.status === 'MATRICULADO' || e.status === 'EN_CURSO'
            ).length,
            icon: 'assignment',
            color: '#ff9800'
          }
        ];

        // Cards
        this.cards = [
          {
            title: 'Estudiantes',
            value: data.students.length,
            icon: 'school',
            color: '#11998e',
            route: '/students'
          },
          {
            title: 'Profesores',
            value: data.professors.length,
            icon: 'person',
            color: '#ee0979',
            route: '/professors'
          },
          {
            title: 'Cursos',
            value: data.courses.length,
            icon: 'book',
            color: '#667eea',
            route: '/courses'
          },
          {
            title: 'Ofertas de Cursos',
            value: data.offerings.length,
            icon: 'class',
            color: '#e91e63',
            route: '/offerings'
          },
          {
            title: 'Matrículas',
            value: data.enrollments.length,
            icon: 'assignment',
            color: '#ff9800',
            route: '/enrollments'
          }
        ];

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadProfessorDashboard(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.loading = false;
      return;
    }

    this.professorService.getProfessorByUserId(userId).subscribe({
      next: (professor) => {
        this.offeringService.getOfferingsByProfessor(professor.id).subscribe({
          next: (offerings) => {
            const totalStudents = offerings.reduce((sum, o) => sum + o.currentEnrollment, 0);

            // Stats
            this.stats = [
              {
                label: 'Mis Cursos',
                value: offerings.length,
                icon: 'class',
                color: '#ee0979'
              },
              {
                label: 'Total Estudiantes',
                value: totalStudents,
                icon: 'groups',
                color: '#11998e'
              },
              {
                label: 'Cursos Activos',
                value: offerings.filter(o => o.status === 'EN_CURSO').length,
                icon: 'play_circle',
                color: '#667eea'
              }
            ];

            // Cards
            this.cards = [
              {
                title: 'Mis Cursos',
                value: offerings.length,
                icon: 'class',
                color: '#ee0979',
                route: '/professor/my-courses'
              },
              {
                title: 'Mis Estudiantes',
                value: totalStudents,
                icon: 'groups',
                color: '#11998e',
                route: '/professor/my-students'
              },
              {
                title: 'Calificar',
                value: 'Asignar Notas',
                icon: 'grading',
                color: '#ff9800',
                route: '/grades/manage'
              },
              {
                title: 'Mi Horario',
                value: 'Ver Horario',
                icon: 'schedule',
                color: '#667eea',
                route: '/schedule'
              }
            ];

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

  loadStudentDashboard(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.loading = false;
      return;
    }

    this.studentService.getByUserId(userId).subscribe({
      next: (student) => {
        this.enrollmentService.getEnrollmentsByStudent(student.id).subscribe({
          next: (enrollments) => {
            const activeEnrollments = enrollments.filter(e => 
              e.status === 'MATRICULADO' || e.status === 'EN_CURSO'
            );
            const completedEnrollments = enrollments.filter(e => 
              e.status === 'APROBADO' || e.status === 'REPROBADO'
            );
            const approvedCount = enrollments.filter(e => e.status === 'APROBADO').length;

            // Stats
            this.stats = [
              {
                label: 'Cursos Activos',
                value: activeEnrollments.length,
                icon: 'class',
                color: '#11998e'
              },
              {
                label: 'Créditos Totales',
                value: student.totalCredits || 0,
                icon: 'grade',
                color: '#667eea'
              },
              {
                label: 'Cursos Aprobados',
                value: approvedCount,
                icon: 'check_circle',
                color: '#4caf50'
              },
              {
                label: 'Semestre Actual',
                value: student.currentSemester + '°',
                icon: 'school',
                color: '#ee0979'
              }
            ];

            // Cards
            this.cards = [
              {
                title: 'Mis Matrículas',
                value: enrollments.length,
                icon: 'assignment',
                color: '#11998e',
                route: '/enrollments/my-enrollments'
              },
              {
                title: 'Ofertas de Cursos',
                value: 'Ver Disponibles',
                icon: 'class',
                color: '#e91e63',
                route: '/offerings'
              },
              {
                title: 'Mis Calificaciones',
                value: completedEnrollments.length + ' cursos',
                icon: 'grade',
                color: '#ff9800',
                route: '/grades'
              },
              {
                title: 'Mi Horario',
                value: 'Ver Horario',
                icon: 'schedule',
                color: '#667eea',
                route: '/schedule'
              }
            ];

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
}