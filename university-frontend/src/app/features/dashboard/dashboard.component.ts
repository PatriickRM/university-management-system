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

  ngOnInit(): void {
    this.loadDashboardCards();
  }

  loadDashboardCards(): void {
    const user = this.authService.getCurrentUser();
    const isAdmin = this.authService.hasRole('ADMIN');
    const isStudent = this.authService.hasRole('STUDENT');
    const isProfessor = this.authService.hasRole('PROFESSOR');

    this.cards = [];

    if (isAdmin) {
      this.cards.push(
        {
          title: 'Estudiantes',
          value: 'Gestionar',
          icon: 'school',
          color: '#3f51b5',
          route: '/students'
        },
        {
          title: 'Profesores',
          value: 'Gestionar',
          icon: 'person',
          color: '#009688',
          route: '/professors'
        },
        {
          title: 'Cursos',
          value: 'Gestionar',
          icon: 'book',
          color: '#ff9800',
          route: '/courses'
        },
        {
          title: 'Matrículas',
          value: 'Gestionar',
          icon: 'assignment',
          color: '#e91e63',
          route: '/enrollments'
        }
      );
    } else if (isStudent) {
      this.cards.push(
        {
          title: 'Mis Cursos',
          value: 'Ver',
          icon: 'book',
          color: '#3f51b5',
          route: '/enrollments'
        },
        {
          title: 'Matrícula',
          value: 'Inscribirse',
          icon: 'assignment',
          color: '#009688',
          route: '/courses'
        },
        {
          title: 'Mi Perfil',
          value: 'Ver',
          icon: 'account_circle',
          color: '#ff9800',
          route: '/students'
        }
      );
    } else if (isProfessor) {
      this.cards.push(
        {
          title: 'Mis Cursos',
          value: 'Ver',
          icon: 'book',
          color: '#3f51b5',
          route: '/courses'
        },
        {
          title: 'Estudiantes',
          value: 'Ver',
          icon: 'school',
          color: '#009688',
          route: '/students'
        },
        {
          title: 'Mi Perfil',
          value: 'Ver',
          icon: 'account_circle',
          color: '#ff9800',
          route: '/professors'
        }
      );
    }
  }

  getInitials(firstName?: string, lastName?: string): string {
    if (!firstName) return 'U';
    const first = firstName.charAt(0).toUpperCase();
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  }
}