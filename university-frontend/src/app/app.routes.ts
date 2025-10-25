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
  {
    path: 'students',
    loadComponent: () => import('../app/features/student/student-list.component').then(m => m.StudentListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'STUDENT'] }
  },
  {
    path: 'students/create',
    loadComponent: () => import('../app/features/student/student-list.component').then(m => m.StudentListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  
  {
    path: 'professors',
    loadComponent: () => import('../app/features/professor/professor-list.component').then(m => m.ProfessorListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'PROFESSOR'] }
  },
  {
    path: 'courses',
    loadComponent: () => import('../app/features/course/course-list.component').then(m => m.CourseListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'courses/available',
    loadComponent: () => import('../app/features/course/course-list.component').then(m => m.CourseListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] }
  },
  {
    path: 'courses/my-courses',
    loadComponent: () => import('../app/features/course/course-list.component').then(m => m.CourseListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PROFESSOR'] }
  },
  {
    path: 'schedule',
    loadComponent: () => import('./features/schedule/schedule-view.component').then(m => m.ScheduleViewComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT', 'PROFESSOR'] }
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  /*
  {
    path: 'enrollments',
    loadComponent: () => import('./features/enrollments/enrollment-list/enrollment-list.component').then(m => m.EnrollmentListComponent),
    canActivate: [authGuard]
  },
  */
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];