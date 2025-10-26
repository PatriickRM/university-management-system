import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { AcademicPeriodService } from '../../core/services/academic-period.service';
import { StudentService } from '../../core/services/student.service';
import { AuthService } from '../../core/services/auth.service';
import { Enrollment } from '../../core/models/enrollment.model';
import { AcademicPeriod } from '../../core/models/academic-period.model';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.scss']
})
export class EnrollmentListComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private periodService = inject(AcademicPeriodService);
  private studentService = inject(StudentService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = [
    'enrollmentDate',
    'student',
    'course',
    'professor',
    'period',
    'status',
    'finalGrade',
    'actions'
  ];

  dataSource = new MatTableDataSource<Enrollment>();
  periods: AcademicPeriod[] = [];
  loading = false;
  
  periodFilter = new FormControl<number | null>(null);
  statusFilter = new FormControl<string | null>(null);

  isAdmin = false;
  isStudent = false;
  isProfessor = false;
  currentStudentId: number | null = null;

  statusOptions = [
    { value: 'MATRICULADO', label: 'Matriculado' },
    { value: 'EN_CURSO', label: 'En Curso' },
    { value: 'COMPLETADO', label: 'Completado' },
    { value: 'RETIRADO', label: 'Retirado' },
    { value: 'APROBADO', label: 'Aprobado' },
    { value: 'REPROBADO', label: 'Reprobado' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.isStudent = this.authService.hasRole('STUDENT');
    this.isProfessor = this.authService.hasRole('PROFESSOR');

    this.loadPeriods();
    this.loadEnrollments();
    this.setupFilters();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPeriods(): void {
    this.periodService.getAllPeriods().subscribe({
      next: (periods) => {
        this.periods = periods.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      },
      error: (err) => console.error(err)
    });
  }

  loadEnrollments(): void {
    this.loading = true;

    if (this.isStudent) {
      const userId = this.authService.getUserIdFromToken();
      if (!userId) {
        this.loading = false;
        return;
      }

      this.studentService.getByUserId(userId).subscribe({
        next: (student) => {
          this.currentStudentId = student.id;
          this.enrollmentService.getEnrollmentsByStudent(student.id).subscribe({
            next: (enrollments) => {
              this.dataSource.data = enrollments;
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
    } else if (this.isAdmin) {
      this.enrollmentService.getAllEnrollments().subscribe({
        next: (enrollments) => {
          this.dataSource.data = enrollments;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  setupFilters(): void {
    this.periodFilter.valueChanges.subscribe(() => this.applyFilters());
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    const periodId = this.periodFilter.value;
    const status = this.statusFilter.value;

    let filtered = [...this.dataSource.data];

    if (periodId) {
      filtered = filtered.filter(e => e.courseOffering.periodCode === 
        this.periods.find(p => p.id === periodId)?.periodCode);
    }

    if (status) {
      filtered = filtered.filter(e => e.status === status);
    }

    this.dataSource.data = filtered;
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

  openGradeDialog(enrollment: Enrollment): void {
    import('./grade-dialog/grade-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.GradeDialogComponent, {
        width: '400px',
        data: { enrollment }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadEnrollments();
      });
    });
  }

  withdrawEnrollment(enrollment: Enrollment): void {
    if (confirm(`¿Retirarse del curso ${enrollment.courseOffering.courseName}?`)) {
      this.enrollmentService.withdrawEnrollment(enrollment.id).subscribe({
        next: () => {
          this.snackBar.open('Retirado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadEnrollments();
        },
        error: (err) => console.error(err)
      });
    }
  }

  canWithdraw(enrollment: Enrollment): boolean {
    return this.isStudent && 
           (enrollment.status === 'MATRICULADO' || enrollment.status === 'EN_CURSO');
  }

  canGrade(enrollment: Enrollment): boolean {
    return (this.isAdmin || this.isProfessor) && 
           enrollment.status === 'COMPLETADO';
  }
}