import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  /*{
    path: 'students',
    loadComponent: () => import('./features/students/student-list/student-list.component').then(m => m.StudentListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'STUDENT'] }
  },
  {
    path: 'students/create',
    loadComponent: () => import('./features/students/student-form/student-form.component').then(m => m.StudentFormComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'professors',
    loadComponent: () => import('./features/professors/professor-list/professor-list.component').then(m => m.ProfessorListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'PROFESSOR'] }
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/courses/course-list/course-list.component').then(m => m.CourseListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'enrollments',
    loadComponent: () => import('./features/enrollments/enrollment-list/enrollment-list.component').then(m => m.EnrollmentListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },*/
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];