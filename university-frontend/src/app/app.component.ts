import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './core/services/auth.service';
import { MessageService } from './core/services/message.service';
import { User } from './core/models/user.model';
import { Subscription, filter } from 'rxjs';

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
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  currentUser$ = this.authService.currentUser$;
  unreadMessages = 0;
  
  private subscriptions: Subscription[] = [];

  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  allMenuItems: MenuItem[] = [
    //ADMIN & PROFESSOR
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', roles: ['ADMIN', 'PROFESSOR'] },
    
    //ADMIN
    { icon: 'school', label: 'Gestión de Estudiantes', route: '/students', roles: ['ADMIN'] },
    { icon: 'person', label: 'Gestión de Profesores', route: '/professors', roles: ['ADMIN'] },
    { icon: 'book', label: 'Gestión de Cursos', route: '/courses', roles: ['ADMIN'] },
    { icon: 'class', label: 'Ofertas de Cursos', route: '/offerings', roles: ['ADMIN'] },
    { icon: 'assignment', label: 'Control de Matrículas', route: '/enrollments', roles: ['ADMIN'] },
    { icon: 'calendar_today', label: 'Períodos Académicos', route: '/periods', roles: ['ADMIN'] },
    { icon: 'business', label: 'Departamentos', route: '/departments', roles: ['ADMIN'] },
    { icon: 'analytics', label: 'Reportes y Estadísticas', route: '/reports', roles: ['ADMIN'] },
    
    //PROFESSOR
    { icon: 'class', label: 'Mis Cursos', route: '/professor/my-courses', roles: ['PROFESSOR'] },
    { icon: 'groups', label: 'Mis Estudiantes', route: '/professor/my-students', roles: ['PROFESSOR'] },
    { icon: 'grading', label: 'Registrar Calificaciones', route: '/grades/manage', roles: ['PROFESSOR'] },
    { icon: 'schedule', label: 'Mi Horario', route: '/professor/schedule', roles: ['PROFESSOR'] },
    
    //STUDENT
    { icon: 'home', label: 'Portal Estudiantil', route: '/student/portal', roles: ['STUDENT'] },
    { icon: 'mail', label: 'Mensajes', route: '/student/messages', roles: ['STUDENT'] },
    { icon: 'account_circle', label: 'Mi Perfil', route: '/student/profile', roles: ['STUDENT'] },
  ];

  ngOnInit(): void {
    //Escuchar cambios en el usuario autenticado
    const userSub = this.currentUser$.subscribe(user => {
      if (user) {
        this.checkUserRoleAndRedirect();
        this.loadUnreadMessages();
      }
    });

    //Escuchar cambios de navegación
    const routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkUserRoleAndRedirect();
      });

    this.subscriptions.push(userSub, routerSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  checkUserRoleAndRedirect(): void {
    const user = this.currentUser;
    if (!user) return;

    const currentUrl = this.router.url;

    // Si es estudiante y está en dashboard o raíz, redirigir al portal
    if (this.authService.hasRole('STUDENT')) {
      if (currentUrl === '/dashboard' || currentUrl === '/' || currentUrl === '') {
        this.router.navigate(['/student/portal']);
      }
    }
    // Si es ADMIN o PROFESSOR y está en la raíz, redirigir al dashboard
    else if (this.authService.hasRole('ADMIN') || this.authService.hasRole('PROFESSOR')) {
      if (currentUrl === '/' || currentUrl === '') {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  loadUnreadMessages(): void {
    if (this.authService.hasRole('STUDENT') || this.authService.hasRole('PROFESSOR')) {
      this.messageService.getUnreadCount().subscribe({
        next: (result) => {
          this.unreadMessages = result.unreadCount;
        },
        error: (err) => console.error('Error loading unread messages:', err)
      });
    }
  }

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

  isStudentPortalPage(): boolean {
    return this.router.url.startsWith('/student/');
  }

  shouldShowSidebar(): boolean {
    return !this.isLoginPage() && !this.isStudentPortalPage();
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