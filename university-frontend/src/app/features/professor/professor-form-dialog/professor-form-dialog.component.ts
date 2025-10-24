import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Professor, ProfessorCreateRequest } from '../../../core/models/professor.model';
import { ProfessorService } from '../../../core/services/professor.service';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/professor.model';

@Component({
  selector: 'app-professor-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatStepperModule
  ],
  templateUrl: './professor-form-dialog.component.html',
  styleUrls: ['./professor-form-dialog.component.scss']
})
export class ProfessorFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private professorService = inject(ProfessorService);
  private departmentService = inject(DepartmentService);
  private snackBar = inject(MatSnackBar);

  userInfoForm!: FormGroup;
  professorInfoForm!: FormGroup;
  
  departments: Department[] = [];
  loading = false;
  mode: 'create' | 'edit' | 'view' = 'create';
  professor?: Professor;

  genderOptions = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' },
    { value: 'OTRO', label: 'Otro' }
  ];

  employmentTypeOptions = [
    { value: 'FULL_TIME', label: 'Tiempo Completo' },
    { value: 'PART_TIME', label: 'Tiempo Parcial' }
  ];

  constructor(
    public dialogRef: MatDialogRef<ProfessorFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode || 'create';
    this.professor = data.professor;
  }

  ngOnInit(): void {
    this.initForms();
    this.loadDepartments();
    
    if (this.mode === 'edit' || this.mode === 'view') {
      this.loadProfessorData();
    }

    if (this.mode === 'view') {
      this.userInfoForm.disable();
      this.professorInfoForm.disable();
    }
  }

  initForms(): void {
    this.userInfoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', this.mode === 'create' ? [Validators.required, Validators.minLength(8)] : []],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      nationalId: ['', [Validators.required, Validators.minLength(8)]],
      gender: ['', Validators.required]
    });

    this.professorInfoForm = this.fb.group({
      employeeCode: ['', [Validators.required, Validators.minLength(6)]],
      departmentId: ['', Validators.required],
      employmentType: ['', Validators.required],
      hireDate: ['', Validators.required],
      officeLocation: [''],
      specialization: ['']
    });
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

  loadProfessorData(): void {
    if (!this.professor) return;

    this.userInfoForm.patchValue({
      email: this.professor.user.email,
      username: this.professor.user.username,
      firstName: this.professor.user.firstName,
      lastName: this.professor.user.lastName,
      phoneNumber: this.professor.user.phoneNumber,
      address: this.professor.user.address,
      dateOfBirth: this.professor.user.dateOfBirth,
      nationalId: this.professor.user.nationalId,
      gender: this.professor.user.gender
    });

    this.professorInfoForm.patchValue({
      employeeCode: this.professor.employeeCode,
      departmentId: this.professor.department.id,
      employmentType: this.professor.employmentType,
      hireDate: this.professor.hireDate,
      officeLocation: this.professor.officeLocation,
      specialization: this.professor.specialization
    });
  }

  onSubmit(): void {
    if (this.userInfoForm.invalid || this.professorInfoForm.invalid) {
      this.userInfoForm.markAllAsTouched();
      this.professorInfoForm.markAllAsTouched();
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.loading = true;

    if (this.mode === 'edit' && this.professor) {
      const updateData = { ...this.professorInfoForm.value };

      this.professorService.updateProfessor(this.professor.id, updateData).subscribe({
        next: () => {
          this.snackBar.open('Profesor actualizado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error updating professor:', error);
        }
      });
    } else {
      const professorData: ProfessorCreateRequest = {
        userInfo: {
          ...this.userInfoForm.value,
          dateOfBirth: this.formatDate(this.userInfoForm.value.dateOfBirth)
        },
        ...this.professorInfoForm.value,
        hireDate: this.formatDate(this.professorInfoForm.value.hireDate)
      };

      this.professorService.createProfessor(professorData).subscribe({
        next: () => {
          this.snackBar.open('Profesor creado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error creating professor:', error);
        }
      });
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  close(): void {
    this.dialogRef.close();
  }

  get dialogTitle(): string {
    switch (this.mode) {
      case 'create': return 'Nuevo Profesor';
      case 'edit': return 'Editar Profesor';
      case 'view': return 'Detalle del Profesor';
      default: return 'Profesor';
    }
  }
}