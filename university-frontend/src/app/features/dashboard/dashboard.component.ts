import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../core/services/auth.service';

interface DashboardCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  route: string;
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
    MatGridListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  
  currentUser$ = this.authService.currentUser$;
  cards: DashboardCard[] = [];

  userRole: string = '';
  dashboardTitle: string = '';
  dashboardSubtitle: string = '';
  stats: any[] = [];

  ngOnInit(): void {
    this.determineUserRole();
    this.loadDashboardCards();
    this.loadStats();
  }

  determineUserRole(): void {
    if (this.authService.hasRole('ADMIN')) {
      this.userRole = 'ADMIN';
      this.dashboardTitle = 'Panel de Administración';
      this.dashboardSubtitle = 'Gestiona todo el sistema universitario';
    } else if (this.authService.hasRole('STUDENT')) {
      this.userRole = 'STUDENT';
      this.dashboardTitle = 'Mi Portal Estudiantil';
      this.dashboardSubtitle = 'Accede a tus cursos y calificaciones';
    } else if (this.authService.hasRole('PROFESSOR')) {
      this.userRole = 'PROFESSOR';
      this.dashboardTitle = 'Portal del Profesor';
      this.dashboardSubtitle = 'Gestiona tus cursos y estudiantes';
    }
  }

  loadDashboardCards(): void {
    this.cards = [];

    if (this.userRole === 'ADMIN') {
      this.cards = [
        {
          title: 'Estudiantes',
          value: 'Gestión Total',
          icon: 'school',
          color: '#3f51b5',
          route: '/students'
        },
        {
          title: 'Profesores',
          value: 'Gestión Total',
          icon: 'person',
          color: '#009688',
          route: '/professors'
        },
        {
          title: 'Cursos',
          value: 'Catálogo',
          icon: 'book',
          color: '#ff9800',
          route: '/courses'
        },
        {
          title: 'Matrículas',
          value: 'Control',
          icon: 'assignment',
          color: '#e91e63',
          route: '/enrollments'
        },
        {
          title: 'Períodos',
          value: 'Académicos',
          icon: 'calendar_today',
          color: '#9c27b0',
          route: '/periods'
        },
        {
          title: 'Departamentos',
          value: 'Gestionar',
          icon: 'business',
          color: '#607d8b',
          route: '/departments'
        }
      ];
    } else if (this.userRole === 'STUDENT') {
      this.cards = [
        {
          title: 'Mis Matrículas',
          value: 'Activas',
          icon: 'assignment',
          color: '#3f51b5',
          route: '/enrollments/my-enrollments'
        },
        {
          title: 'Cursos Disponibles',
          value: 'Inscribirse',
          icon: 'book',
          color: '#009688',
          route: '/courses/available'
        },
        {
          title: 'Mis Calificaciones',
          value: 'Ver Notas',
          icon: 'grade',
          color: '#ff9800',
          route: '/grades'
        },
        {
          title: 'Mi Horario',
          value: 'Ver',
          icon: 'schedule',
          color: '#e91e63',
          route: '/schedule'
        }
      ];
    } else if (this.userRole === 'PROFESSOR') {
      this.cards = [
        {
          title: 'Mis Cursos',
          value: 'Asignados',
          icon: 'book',
          color: '#3f51b5',
          route: '/professor/my-courses'
        },
        {
          title: 'Mis Estudiantes',
          value: 'Matriculados',
          icon: 'school',
          color: '#009688',
          route: '/professor/my-students'
        },
        {
          title: 'Calificaciones',
          value: 'Gestionar',
          icon: 'grade',
          color: '#ff9800',
          route: '/grades/manage'
        },
        {
          title: 'Horario',
          value: 'Visualizar',
          icon: 'hourglass_top',
          color: '#e91e63',
          route: '/schedule'
        }
      ];
    }
  }

  loadStats(): void {
    if (this.userRole === 'ADMIN') {
      this.stats = [
        { label: 'Total Estudiantes', value: '1,234', trend: '+12%', icon: 'trending_up', color: '#4caf50' },
        { label: 'Total Profesores', value: '156', trend: '+5%', icon: 'trending_up', color: '#4caf50' },
        { label: 'Cursos Activos', value: '89', trend: '0%', icon: 'remove', color: '#ff9800' },
        { label: 'Matrículas Hoy', value: '45', trend: '+8%', icon: 'trending_up', color: '#4caf50' }
      ];
    } else if (this.userRole === 'STUDENT') {
      this.stats = [
        { label: 'Cursos Actuales', value: '5', trend: '', icon: 'book', color: '#3f51b5' },
        { label: 'Promedio General', value: '16.8', trend: '+0.5', icon: 'trending_up', color: '#4caf50' },
        { label: 'Créditos', value: '45/120', trend: '', icon: 'school', color: '#009688' },
        { label: 'Asistencia', value: '92%', trend: '', icon: 'check_circle', color: '#4caf50' }
      ];
    } else if (this.userRole === 'PROFESSOR') {
      this.stats = [
        { label: 'Cursos Asignados', value: '3', trend: '', icon: 'book', color: '#3f51b5' },
        { label: 'Total Estudiantes', value: '87', trend: '', icon: 'school', color: '#009688' },
        { label: 'Calificaciones Pendientes', value: '12', trend: '', icon: 'pending', color: '#ff9800' },
        { label: 'Asistencias del Día', value: '3/3', trend: '', icon: 'check_circle', color: '#4caf50' }
      ];
    }
  }

  getInitials(firstName?: string, lastName?: string): string {
    if (!firstName) return 'U';
    const first = firstName.charAt(0).toUpperCase();
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  }
}