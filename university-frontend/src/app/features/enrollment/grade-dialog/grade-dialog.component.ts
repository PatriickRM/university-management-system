import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Enrollment } from '../../../core/models/enrollment.model';

@Component({
  selector: 'app-grade-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './grade-dialog.component.html',
  styleUrls: ['./grade-dialog.component.scss']
})
export class GradeDialogComponent {
  private fb = inject(FormBuilder);
  private enrollmentService = inject(EnrollmentService);
  private snackBar = inject(MatSnackBar);

  gradeForm: FormGroup;
  loading = false;
  enrollment: Enrollment;

  constructor(
    public dialogRef: MatDialogRef<GradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.enrollment = data.enrollment;
    this.gradeForm = this.fb.group({
      finalGrade: [
        this.enrollment.finalGrade || null,
        [Validators.required, Validators.min(0), Validators.max(20)]
      ]
    });
  }

  isApproved(): boolean {
    const grade = this.gradeForm.get('finalGrade')?.value;
    return grade !== null && grade >= 10.5;
  }

  onSubmit(): void {
    if (this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const grade = this.gradeForm.get('finalGrade')?.value;

    const action = this.isApproved() 
      ? this.enrollmentService.approveEnrollment(this.enrollment.id, grade)
      : this.enrollmentService.failEnrollment(this.enrollment.id, grade);

    action.subscribe({
      next: () => {
        this.snackBar.open('Nota registrada exitosamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}