import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EnrollmentService } from '../../core/services/enrollment.service';
import { StudentService } from '../../core/services/student.service';
import { AuthService } from '../../core/services/auth.service';
import { Enrollment } from '../../core/models/enrollment.model';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule
  ],
 templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.scss']
})
export class EnrollmentListComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  enrollments: Enrollment[] = [];
  loading = false;
  syncing = false;
  isAdmin = false;
  isStudent = false;

  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.isStudent = this.authService.hasRole('STUDENT');

    if (this.isAdmin) {
      this.displayedColumns = ['studentCode', 'studentName', 'course', 'period', 'professor', 'enrollmentDate', 'status', 'grade', 'actions'];
    } else {
      this.displayedColumns = ['course', 'period', 'professor', 'enrollmentDate', 'status', 'actions'];
    }

    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.loading = true;

    if (this.isAdmin) {
      this.enrollmentService.getAllEnrollments().subscribe({
        next: (enrollments) => {
          this.enrollments = enrollments;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    } else if (this.isStudent) {
      const userId = this.authService.getUserIdFromToken();
      if (!userId) {
        this.loading = false;
        return;
      }

      this.studentService.getByUserId(userId).subscribe({
        next: (student) => {
          this.enrollmentService.getEnrollmentsByStudent(student.id).subscribe({
            next: (enrollments) => {
              this.enrollments = enrollments;
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

  syncStatuses(): void {
    if (confirm('¿Sincronizar estados de matrículas según fechas del período académico?')) {
      this.syncing = true;
      
      this.enrollmentService.syncEnrollmentStatuses().subscribe({
        next: () => {
          this.snackBar.open('Estados sincronizados correctamente', 'Cerrar', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.syncing = false;
          this.loadEnrollments();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al sincronizar estados', 'Cerrar', { 
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.syncing = false;
        }
      });
    }
  }

  editEnrollment(enrollment: Enrollment): void {
    import('./enrollment-edit-dialog/enrollment-edit-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.EnrollmentEditDialogComponent, {
        width: '500px',
        data: { enrollment }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadEnrollments();
        }
      });
    });
  }

  deleteEnrollment(enrollment: Enrollment): void {
    if (confirm(`¿Eliminar matrícula de ${enrollment.student.fullName}?`)) {
      this.enrollmentService.deleteEnrollment(enrollment.id).subscribe({
        next: () => {
          this.snackBar.open('Matrícula eliminada', 'Cerrar', { duration: 3000 });
          this.loadEnrollments();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  withdrawEnrollment(enrollment: Enrollment): void {
    if (confirm('¿Estás seguro de retirarte de este curso?')) {
      this.enrollmentService.withdrawEnrollment(enrollment.id).subscribe({
        next: () => {
          this.snackBar.open('Te has retirado del curso', 'Cerrar', { duration: 3000 });
          this.loadEnrollments();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al retirarse', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  canWithdraw(enrollment: Enrollment): boolean {
    return enrollment.status === 'MATRICULADO' || enrollment.status === 'EN_CURSO';
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'MATRICULADO': 'primary',
      'EN_CURSO': 'accent',
      'COMPLETADO': 'accent',
      'RETIRADO': 'warn',
      'APROBADO': 'primary',
      'REPROBADO': 'warn'
    };
    return colors[status] || 'primary';
  }
}