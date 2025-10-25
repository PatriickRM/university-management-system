
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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { Course } from '../../core/models/course.model';
import { Department } from '../../core/models/professor.model';
import { AuthService } from '../../core/services/auth.service';
import { DepartmentService } from '../../core/services/department.service';
import { CourseFormDialogComponent } from './course-form-dialog/course-form-dialog.component';
import { Injectable } from '@angular/core';
import { CourseService } from '../../core/services/course.service';


@Injectable({ providedIn: 'root' })


@Component({
  selector: 'app-course-list',
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
    MatDialogModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private departmentService = inject(DepartmentService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Vista actual: 'grid' o 'table'
  viewMode: 'grid' | 'table' = 'grid';

  displayedColumns: string[] = [
    'courseCode',
    'courseName',
    'department',
    'credits',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Course>();
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  departments: Department[] = [];
  
  loading = false;
  isAdmin = false;

  // Filtros
  filterForm = new FormGroup({
    search: new FormControl(''),
    departmentId: new FormControl<number | null>(null),
    credits: new FormControl<number | null>(null),
    status: new FormControl<string | null>(null)
  });

  creditOptions = [1, 2, 3, 4, 5, 6];
  statusOptions = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.loadDepartments();
    this.loadCourses();
    this.setupFilters();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments.filter(d => d.status === 'ACTIVO');
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.filteredCourses = courses;
        this.dataSource.data = courses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar cursos', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  setupFilters(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  applyFilters(): void {
    const { search, departmentId, credits, status } = this.filterForm.value;
    
    let filtered = [...this.courses];

    // Filtro de búsqueda
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(course => 
        course.courseCode.toLowerCase().includes(searchLower) ||
        course.courseName.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por departamento
    if (departmentId) {
      filtered = filtered.filter(course => course.department.id === departmentId);
    }

    // Filtro por créditos
    if (credits) {
      filtered = filtered.filter(course => course.credits === credits);
    }

    // Filtro por status
    if (status) {
      filtered = filtered.filter(course => course.status === status);
    }

    this.filteredCourses = filtered;
    this.dataSource.data = filtered;
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  toggleView(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
  }

  getDepartmentColor(departmentCode: string): string {
    const colors: { [key: string]: string } = {
      'CS': '#667eea',
      'ENG': '#f093fb',
      'MED': '#4facfe',
      'LAW': '#fa709a',
      'BUS': '#feca57'
    };
    return colors[departmentCode] || '#3f51b5';
  }

  getStatusColor(status: string): string {
    return status === 'ACTIVO' ? 'primary' : 'warn';
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CourseFormDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: true,
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCourses();
      }
    });
  }

  openEditDialog(course: Course): void {
    const dialogRef = this.dialog.open(CourseFormDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: true,
      data: { mode: 'edit', course: course }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCourses();
      }
    });
  }

  viewCourse(course: Course): void {
    this.dialog.open(CourseFormDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { mode: 'view', course: course }
    });
  }

  deleteCourse(course: Course): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el curso ${course.courseName}?`)) {
      this.courseService.deleteCourse(course.id).subscribe({
        next: () => {
          this.snackBar.open('Curso eliminado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error deleting course:', error);
          this.snackBar.open('Error al eliminar curso', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getCreditIcon(credits: number): string {
    if (credits <= 2) return 'looks_one';
    if (credits <= 4) return 'looks_two';
    return 'looks_3';
  }
}