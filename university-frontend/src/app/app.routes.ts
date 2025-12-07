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
  
  //ADMIN
  {
    path: 'students',
    loadComponent: () => import('./features/student/student-list.component').then(m => m.StudentListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'STUDENT'] }
  },
  {
    path: 'students/create',
    loadComponent: () => import('./features/student/student-list.component').then(m => m.StudentListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'professors',
    loadComponent: () => import('./features/professor/professor-list.component').then(m => m.ProfessorListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'PROFESSOR'] }
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/course/course-list.component').then(m => m.CourseListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'periods',
    loadComponent: () => import('./features/academic-period/period-list.component').then(m => m.PeriodListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'offerings',
    loadComponent: () => import('./features/course-offering/offering-list.component').then(m => m.OfferingListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'STUDENT'] }
  },
  {
    path: 'enrollments',
    loadComponent: () => import('./features/enrollment/enrollment-list.component').then(m => m.EnrollmentListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'departments',
    loadComponent: () => import('./features/department/department-list.component').then(m => m.DepartmentListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  
  //PROFESSOR
  {
    path: 'professor/my-courses',
    loadComponent: () => import('./features/professor/professor-courses.component').then(m => m.ProfessorCoursesComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PROFESSOR'] }
  },
  {
    path: 'professor/my-students',
    loadComponent: () => import('./features/professor/professor-students.component').then(m => m.ProfessorStudentsComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PROFESSOR'] }
  },
  {
    path: 'professor/schedule',
    loadComponent: () => import('./features/schedule/schedule-view.component').then(m => m.ScheduleViewComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PROFESSOR'] }
  },
  {
    path: 'grades/manage',
    loadComponent: () => import('./features/professor/professor-grades.component').then(m => m.ProfessorGradesComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PROFESSOR'] }
  },
  
  //STUDENT
  {
    path: 'student/portal',
    loadComponent: () => import('./features/student/student-portal/student-portal.component').then(m => m.StudentPortalComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] }
  },
  {
    path: 'student/messages',
    loadComponent: () => import('./features/student/student-messages/student-messages.component').then(m => m.StudentMessagesComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] }
  },
  {
    path: 'student/profile',
    loadComponent: () => import('./features/student/student-profile/student-profile.component').then(m => m.StudentProfileComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] }
  },
  {
    path: 'enrollments/my-enrollments',
    loadComponent: () => import('./features/enrollment/enrollment-list.component').then(m => m.EnrollmentListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] }
  },
  {
    path: 'grades',
    loadComponent: () => import('./features/student/student-grades.component').then(m => m.StudentGradesComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] }
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
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];