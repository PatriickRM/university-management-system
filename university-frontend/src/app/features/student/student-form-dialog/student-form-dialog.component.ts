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
import { Student, StudentCreateRequest } from '../../../core/models/student.model';
import { StudentService } from '../../../core/services/student.service';
import { CareerService } from '../../../core/services/career.service';
import { Career } from '../../../core/models/career.model';

@Component({
  selector: 'app-student-form-dialog',
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
  templateUrl: './student-form-dialog.component.html',
  styleUrls: ['./student-form-dialog.component.scss']
})
export class StudentFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private careerService = inject(CareerService);
  private snackBar = inject(MatSnackBar);

  userInfoForm!: FormGroup;
  studentInfoForm!: FormGroup;
  
  careers: Career[] = [];
  loading = false;
  mode: 'create' | 'edit' | 'view' = 'create';
  student?: Student;

  genderOptions = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' },
    { value: 'OTRO', label: 'Otro' }
  ];

  constructor(
    public dialogRef: MatDialogRef<StudentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode || 'create';
    this.student = data.student;
  }

  ngOnInit(): void {
    this.initForms();
    this.loadCareers();
    
    if (this.mode === 'edit' || this.mode === 'view') {
      this.loadStudentData();
    }

    if (this.mode === 'view') {
      this.userInfoForm.disable();
      this.studentInfoForm.disable();
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

    this.studentInfoForm = this.fb.group({
      studentCode: ['', [Validators.required, Validators.minLength(6)]],
      careerId: ['', Validators.required],
      currentSemester: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
      admissionDate: ['', Validators.required],
      emergencyContactPhone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]]
    });
  }

  loadCareers(): void {
    this.careerService.getAllCareers().subscribe({
      next: (careers) => {
        this.careers = careers.filter(c => c.status === 'ACTIVO');
      },
      error: (error) => {
        console.error('Error loading careers:', error);
      }
    });
  }

  loadStudentData(): void {
    if (!this.student) return;

    this.userInfoForm.patchValue({
      email: this.student.user.email,
      username: this.student.user.username,
      firstName: this.student.user.firstName,
      lastName: this.student.user.lastName,
      phoneNumber: this.student.user.phoneNumber,
      address: this.student.user.address,
      dateOfBirth: this.student.user.dateOfBirth,
      nationalId: this.student.user.nationalId,
      gender: this.student.user.gender
    });

    this.studentInfoForm.patchValue({
      studentCode: this.student.studentCode,
      careerId: this.student.career.id,
      currentSemester: this.student.currentSemester,
      admissionDate: this.student.admissionDate,
      emergencyContactPhone: this.student.emergencyContactPhone
    });
  }

  onSubmit(): void {
    if (this.userInfoForm.invalid || this.studentInfoForm.invalid) {
      this.userInfoForm.markAllAsTouched();
      this.studentInfoForm.markAllAsTouched();
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.loading = true;

    if (this.mode === 'edit' && this.student) {
      const updateData = { ...this.studentInfoForm.value };

      this.studentService.updateStudent(this.student.id, updateData).subscribe({
        next: () => {
          this.snackBar.open('Estudiante actualizado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error updating student:', error);
        }
      });
    } else {
      const studentData: StudentCreateRequest = {
        userInfo: {
          ...this.userInfoForm.value,
          dateOfBirth: this.formatDate(this.userInfoForm.value.dateOfBirth)
        },
        ...this.studentInfoForm.value,
        admissionDate: this.formatDate(this.studentInfoForm.value.admissionDate)
      };

      this.studentService.createStudent(studentData).subscribe({
        next: () => {
          this.snackBar.open('Estudiante creado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error creating student:', error);
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
      case 'create': return 'Nuevo Estudiante';
      case 'edit': return 'Editar Estudiante';
      case 'view': return 'Detalle del Estudiante';
      default: return 'Estudiante';
    }
  }
}