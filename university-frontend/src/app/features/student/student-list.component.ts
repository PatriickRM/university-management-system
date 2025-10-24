import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { StudentService } from '../../core/services/student.service';
import { Student } from '../../core/models/student.model';
import { AuthService } from '../../core/services/auth.service';
import { StudentFormDialogComponent } from './student-form-dialog/student-form-dialog.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = [
    'studentCode',
    'fullName',
    'email',
    'career',
    'semester',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Student>();
  loading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  searchControl = new FormControl('');
  isAdmin = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.loadStudents();
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilter();
      });
  }

  loadStudents(): void {
    this.loading = true;
    
    if (this.isAdmin) {
      this.studentService.getStudentsPaginated(this.pageIndex, this.pageSize).subscribe({
        next: (response) => {
          this.dataSource.data = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.loading = false;
          this.snackBar.open('Error al cargar estudiantes', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      // Para estudiantes, solo mostrar su propia información
      this.studentService.getAllStudents().subscribe({
        next: (students) => {
          const currentUser = this.authService.getCurrentUser();
          const filtered = students.filter(s => s.user.email === currentUser?.email);
          this.dataSource.data = filtered;
          this.totalElements = filtered.length;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading student:', error);
          this.loading = false;
        }
      });
    }
  }

  applyFilter(): void {
    const filterValue = this.searchControl.value || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadStudents();
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'ACTIVO': 'primary',
      'INACTIVO': 'warn',
      'GRADUADO': 'accent',
      'RETIRADO': 'warn'
    };
    return colors[status] || 'primary';
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(StudentFormDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true,
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudents();
      }
    });
  }

  openEditDialog(student: Student): void {
    const dialogRef = this.dialog.open(StudentFormDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true,
      data: { mode: 'edit', student: student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudents();
      }
    });
  }

  viewStudent(student: Student): void {
    this.dialog.open(StudentFormDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { mode: 'view', student: student }
    });
  }

  deleteStudent(student: Student): void {
    const fullName = `${student.user.firstName} ${student.user.lastName}`;
    
    if (confirm(`¿Estás seguro de que deseas eliminar al estudiante ${fullName}?`)) {
      this.studentService.deleteStudent(student.id).subscribe({
        next: () => {
          this.snackBar.open('Estudiante eliminado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadStudents();
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          this.snackBar.open('Error al eliminar estudiante', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getFullName(student: Student): string {
    return `${student.user.firstName} ${student.user.lastName}`;
  }
}