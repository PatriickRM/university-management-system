import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './core/services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles: string[];
  divider?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser$ = this.authService.currentUser$;

  allMenuItems: MenuItem[] = [
    // Dashboard -
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', roles: ['ADMIN', 'PROFESSOR', 'STUDENT'] },
    
    //ADMIN
    { icon: 'school', label: 'Gestión de Estudiantes', route: '/students', roles: ['ADMIN'] },
    { icon: 'person', label: 'Gestión de Profesores', route: '/professors', roles: ['ADMIN'] },
    { icon: 'book', label: 'Gestión de Cursos', route: '/courses', roles: ['ADMIN'] },
    { icon: 'assignment', label: 'Control de Matrículas', route: '/enrollments', roles: ['ADMIN'] },
    { icon: 'calendar_today', label: 'Períodos Académicos', route: '/periods', roles: ['ADMIN'] },
    { icon: 'business', label: 'Departamentos', route: '/departments', roles: ['ADMIN'] },
    { icon: 'analytics', label: 'Reportes y Estadísticas', route: '/reports', roles: ['ADMIN'] },
    
    //PROFESSOR
    { icon: 'class', label: 'Mis Cursos', route: '/courses/my-courses', roles: ['PROFESSOR'] },
    { icon: 'groups', label: 'Mis Estudiantes', route: '/students/my-students', roles: ['PROFESSOR'] },
    { icon: 'grading', label: 'Registrar Calificaciones', route: '/grades/manage', roles: ['PROFESSOR'] },
    { icon: 'checklist', label: 'Control de Asistencia', route: '/attendance', roles: ['PROFESSOR'] },
    { icon: 'schedule', label: 'Mi Horario', route: '/schedule', roles: ['PROFESSOR'] },
    
    //STUDENT
    { icon: 'assignment', label: 'Mis Matrículas', route: '/enrollments/my-enrollments', roles: ['STUDENT'] },
    { icon: 'search', label: 'Cursos Disponibles', route: '/courses/available', roles: ['STUDENT'] },
    { icon: 'grade', label: 'Mis Calificaciones', route: '/grades', roles: ['STUDENT'] },
    { icon: 'schedule', label: 'Mi Horario', route: '/schedule', roles: ['STUDENT'] },
    { icon: 'account_balance_wallet', label: 'Estado de Cuenta', route: '/payments', roles: ['STUDENT'] },
  ];

  get menuItems(): MenuItem[] {
    const user = this.authService.getCurrentUser();
    if (!user) return [];

    const userRoles = user.roles.map(r => r.name);

    return this.allMenuItems.filter(item => 
      item.roles.some(role => userRoles.includes(role))
    );
  }

  isDivider(item: MenuItem): boolean {
    return item.divider === true || !item.route;
  }

  canShowMenuItem(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return item.roles.some(role => this.authService.hasRole(role));
  }

  logout(): void {
    this.authService.logout();
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  getUserInitials(firstName?: string, lastName?: string): string {
    if (!firstName) return 'U';
    const first = firstName.charAt(0).toUpperCase();
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  }

  getAvatarColor(): string {
    if (this.authService.hasRole('ADMIN')) return '#667eea';
    if (this.authService.hasRole('PROFESSOR')) return '#ee0979';
    if (this.authService.hasRole('STUDENT')) return '#11998e';
    return '#3f51b5';
  }
}