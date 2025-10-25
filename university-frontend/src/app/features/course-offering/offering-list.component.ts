// university-frontend/src/app/features/course-offering/offering-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Student } from '../../core/models/student.model';

import { CourseOfferingService } from '../../core/services/course-offering.service';
import { AcademicPeriodService } from '../../core/services/academic-period.service';
import { CourseOffering } from '../../core/models/course-offering.model';
import { AcademicPeriod } from '../../core/models/academic-period.model';
import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-offering-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './offering-list.component.html',
  styleUrls: ['./offering-list.component.scss']
})
export class OfferingListComponent implements OnInit {
  private offeringService = inject(CourseOfferingService);
  private periodService = inject(AcademicPeriodService);
  private authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);
  private dialog = inject(MatDialog);
  private studentService = inject(StudentService);
  private snackBar = inject(MatSnackBar);

  offerings: CourseOffering[] = [];
  filteredOfferings: CourseOffering[] = [];
  periods: AcademicPeriod[] = [];
  loading = false;

  periodFilter = new FormControl<number | null>(null);
  
  isAdmin = false;
  isStudent = false;
  isProfessor = false;

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.isStudent = this.authService.hasRole('STUDENT');
    this.isProfessor = this.authService.hasRole('PROFESSOR');

    this.loadPeriods();
    this.loadOfferings();
    this.setupPeriodFilter();
  }

  loadPeriods(): void {
    this.periodService.getAllPeriods().subscribe({
      next: (periods) => {
        this.periods = periods.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading periods:', error);
      }
    });
  }

  loadOfferings(): void {
    this.loading = true;

    if (this.isStudent) {
      // Estudiantes ven ofertas disponibles
      this.offeringService.getAvailableOfferings().subscribe({
        next: (offerings) => {
          this.offerings = offerings;
          this.filteredOfferings = offerings;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading offerings:', error);
          this.loading = false;
          this.showError('Error al cargar ofertas');
        }
      });
    } else if (this.isProfessor) {
      // Profesores ven sus ofertas (necesitas obtener el professorId del usuario)
      const user = this.authService.getCurrentUser();
      // Aquí deberías obtener el professorId del usuario actual
      // Por ahora usamos todas las ofertas como fallback
      this.offeringService.getAllOfferings().subscribe({
        next: (offerings) => {
          this.offerings = offerings;
          this.filteredOfferings = offerings;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading offerings:', error);
          this.loading = false;
        }
      });
    } else {
      // Admins ven todas las ofertas
      this.offeringService.getAllOfferings().subscribe({
        next: (offerings) => {
          this.offerings = offerings;
          this.filteredOfferings = offerings;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading offerings:', error);
          this.loading = false;
          this.showError('Error al cargar ofertas');
        }
      });
    }
  }

  setupPeriodFilter(): void {
    this.periodFilter.valueChanges.subscribe((periodId) => {
      if (periodId) {
        this.filteredOfferings = this.offerings.filter(
          o => o.academicPeriod.id === periodId
        );
      } else {
        this.filteredOfferings = this.offerings;
      }
    });
  }

  openCreateDialog(): void {
    // Implementar diálogo de creación
    this.snackBar.open('Función de creación próximamente', 'Cerrar', {
      duration: 3000
    });
  }

  editOffering(offering: CourseOffering): void {
    // Implementar diálogo de edición
    this.snackBar.open('Función de edición próximamente', 'Cerrar', {
      duration: 3000
    });
  }

  deleteOffering(offering: CourseOffering): void {
    if (confirm(`¿Eliminar la oferta de ${offering.course.courseName}?`)) {
      this.offeringService.deleteOffering(offering.id).subscribe({
        next: () => {
          this.showSuccess('Oferta eliminada correctamente');
          this.loadOfferings();
        },
        error: (error) => {
          console.error('Error deleting offering:', error);
          this.showError('Error al eliminar oferta');
        }
      });
    }
  }

  enrollInOffering(offering: CourseOffering): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) { this.showError('No se pudo determinar el usuario'); return; }

    this.studentService.getByUserId(userId).subscribe({
        next: (student: Student) => {
        if (confirm(`¿Matricularte en ${offering.course.courseName}?`)) {
            this.enrollmentService.createEnrollment({
            studentId: student.id,
            courseOfferingId: offering.id
            }).subscribe({
            next: () => { 
                this.showSuccess('Matrícula realizada con éxito'); 
                this.loadOfferings(); 
            },
            error: (error) => { 
                console.error(error);
                this.showError('Error al matricularse'); 
            }
            });
        }
        },
        error: (err) => {
        console.error(err);
        this.showError('No se encontró perfil de estudiante');
        }
    });
    }




  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'ABIERTO': 'primary',
      'CERRADO': 'warn',
      'CANCELADO': 'warn',
      'EN_CURSO': 'accent',
      'COMPLETADO': 'accent'
    };
    return colors[status] || 'primary';
  }

  getEnrollmentPercentage(offering: CourseOffering): number {
    if (offering.maxStudents === 0) return 0;
    return (offering.currentEnrollment / offering.maxStudents) * 100;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}