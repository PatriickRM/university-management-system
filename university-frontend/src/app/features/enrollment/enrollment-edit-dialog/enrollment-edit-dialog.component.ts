import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Enrollment } from '../../../core/models/enrollment.model';

@Component({
  selector: 'app-enrollment-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>edit</mat-icon>
          Editar Matrícula
        </h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <div class="enrollment-info">
          <div class="info-item">
            <label>Estudiante:</label>
            <span>{{ enrollment.student.fullName }}</span>
          </div>
          <div class="info-item">
            <label>Curso:</label>
            <span>{{ enrollment.courseOffering.courseName }}</span>
          </div>
          <div class="info-item">
            <label>Código:</label>
            <span>{{ enrollment.courseOffering.courseCode }}</span>
          </div>
        </div>

        <form [formGroup]="editForm">
          <mat-form-field appearance="outline">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="status">
              @for (status of statuses; track status.value) {
                <mat-option [value]="status.value">
                  {{ status.label }}
                </mat-option>
              }
            </mat-select>
            <mat-icon matPrefix>toggle_on</mat-icon>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button (click)="close()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" 
                [disabled]="loading || editForm.invalid">
          @if (loading) {
            <mat-spinner diameter="20"></mat-spinner>
          }
          @if (!loading) {
            <span>Actualizar</span>
          }
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 1.5rem;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }

      button {
        color: white;
      }
    }

    mat-dialog-content {
      padding: 24px;
    }

    .enrollment-info {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;

      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e0e0e0;

        &:last-child {
          border-bottom: none;
        }

        label {
          font-weight: 600;
          color: #64748b;
        }

        span {
          color: #2c3e50;
        }
      }
    }

    form {
      display: flex;
      flex-direction: column;

      mat-form-field {
        width: 100%;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 12px;

      button {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  `]
})
export class EnrollmentEditDialogComponent {
  private fb = inject(FormBuilder);
  private enrollmentService = inject(EnrollmentService);
  private snackBar = inject(MatSnackBar);

  editForm: FormGroup;
  loading = false;
  enrollment: Enrollment;

  statuses = [
    { value: 'MATRICULADO', label: 'Matriculado' },
    { value: 'EN_CURSO', label: 'En Curso' },
    { value: 'COMPLETADO', label: 'Completado' },
    { value: 'RETIRADO', label: 'Retirado' },
    { value: 'APROBADO', label: 'Aprobado' },
    { value: 'REPROBADO', label: 'Reprobado' }
  ];

  constructor(
    public dialogRef: MatDialogRef<EnrollmentEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.enrollment = data.enrollment;
    this.editForm = this.fb.group({
      status: [this.enrollment.status, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const status = this.editForm.get('status')?.value;

    this.enrollmentService.updateEnrollment(this.enrollment.id, { status }).subscribe({
      next: () => {
        this.snackBar.open('Estado actualizado exitosamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}