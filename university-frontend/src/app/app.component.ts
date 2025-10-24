import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './core/services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles?: string[];
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
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser$ = this.authService.currentUser$;
  isAuthenticated$ = this.authService.currentUser$.pipe();

  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'school', label: 'Estudiantes', route: '/students', roles: ['ADMIN', 'STUDENT'] },
    { icon: 'person', label: 'Profesores', route: '/professors', roles: ['ADMIN', 'PROFESSOR'] },
    { icon: 'book', label: 'Cursos', route: '/courses' },
    { icon: 'assignment', label: 'Matrículas', route: '/enrollments' }
  ];

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
}