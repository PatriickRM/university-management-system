import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { Course } from '../../../core/models/course.model';
import { Department } from '../../../core/models/professor.model';
import { DepartmentService } from '../../../core/services/department.service';
import { CourseService } from '../../../core/services/course.service';


@Component({
  selector: 'app-course-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './course-form-dialog.component.html',
  styleUrls: ['./course-form-dialog.component.scss']
})
export class CourseFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private departmentService = inject(DepartmentService);
  private snackBar = inject(MatSnackBar);

  courseForm!: FormGroup;
  departments: Department[] = [];
  loading = false;
  mode: 'create' | 'edit' | 'view' = 'create';
  course?: Course;

  creditOptions = [1, 2, 3, 4, 5, 6];
  statusOptions = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' }
  ];

  constructor(
    public dialogRef: MatDialogRef<CourseFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode || 'create';
    this.course = data.course;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
    
    if (this.mode === 'edit' || this.mode === 'view') {
      this.loadCourseData();
    }

    if (this.mode === 'view') {
      this.courseForm.disable();
    }
  }

  initForm(): void {
    this.courseForm = this.fb.group({
      courseCode: ['', [Validators.required, Validators.minLength(3)]],
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      credits: ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      departmentId: ['', Validators.required],
      status: [this.mode === 'edit' ? '' : 'ACTIVO']
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments.filter(d => d.status === 'ACTIVO');
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.snackBar.open('Error al cargar departamentos', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadCourseData(): void {
    if (!this.course) return;

    this.courseForm.patchValue({
      courseCode: this.course.courseCode,
      courseName: this.course.courseName,
      description: this.course.description,
      credits: this.course.credits,
      departmentId: this.course.department.id,
      status: this.course.status
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.loading = true;
    const courseData = this.courseForm.value;

    if (this.mode === 'edit' && this.course) {
      this.courseService.updateCourse(this.course.id, courseData).subscribe({
        next: () => {
          this.snackBar.open('Curso actualizado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error updating course:', error);
        }
      });
    } else {
      this.courseService.createCourse(courseData).subscribe({
        next: () => {
          this.snackBar.open('Curso creado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error creating course:', error);
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  get dialogTitle(): string {
    switch (this.mode) {
      case 'create': return 'Nuevo Curso';
      case 'edit': return 'Editar Curso';
      case 'view': return 'Detalle del Curso';
      default: return 'Curso';
    }
  }

  getDepartmentById(id: number): Department | undefined {
    return this.departments.find(d => d.id === id);
  }

  getCreditBadgeClass(credits: number): string {
    if (credits <= 2) return 'low';
    if (credits <= 4) return 'medium';
    return 'high';
  }
}