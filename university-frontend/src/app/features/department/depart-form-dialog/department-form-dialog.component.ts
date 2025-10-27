import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/professor.model';

@Component({
  selector: 'app-department-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>{{ mode === 'create' ? 'add_business' : 'edit' }}</mat-icon>
          {{ mode === 'create' ? 'Nuevo Departamento' : 'Editar Departamento' }}
        </h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <form [formGroup]="deptForm" class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Código</mat-label>
            <input matInput formControlName="departmentCode" placeholder="DEPT-001">
            <mat-icon matPrefix>qr_code</mat-icon>
            <mat-error *ngIf="deptForm.get('departmentCode')?.hasError('required')">
              El código es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="departmentName" placeholder="Ingeniería de Sistemas">
            <mat-icon matPrefix>business</mat-icon>
            <mat-error *ngIf="deptForm.get('departmentName')?.hasError('required')">
              El nombre es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Ubicación</mat-label>
            <input matInput formControlName="location" placeholder="Edificio A - Piso 3">
            <mat-icon matPrefix>location_on</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <textarea matInput formControlName="description" rows="3" 
                      placeholder="Descripción del departamento"></textarea>
            <mat-icon matPrefix>description</mat-icon>
          </mat-form-field>

          @if (mode === 'edit') {
            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select formControlName="status">
                <mat-option value="ACTIVO">Activo</mat-option>
                <mat-option value="INACTIVO">Inactivo</mat-option>
              </mat-select>
              <mat-icon matPrefix>toggle_on</mat-icon>
            </mat-form-field>
          }
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button (click)="close()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" 
                [disabled]="loading || deptForm.invalid">
          @if (loading) {
            <mat-spinner diameter="20"></mat-spinner>
          }
          @if (!loading) {
            <span>{{ mode === 'create' ? 'Crear' : 'Actualizar' }}</span>
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
      overflow-y: auto;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      mat-form-field {
        width: 100%;
      }

      .full-width {
        grid-column: 1 / -1;
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

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DepartmentFormDialogComponent {
  private fb = inject(FormBuilder);
  private departmentService = inject(DepartmentService);
  private snackBar = inject(MatSnackBar);

  deptForm!: FormGroup;
  loading = false;
  mode: 'create' | 'edit' = 'create';
  department?: Department;

  constructor(
    public dialogRef: MatDialogRef<DepartmentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data?.mode || 'create';
    this.department = data?.department;
    this.initForm();
  }

  initForm(): void {
    this.deptForm = this.fb.group({
      departmentCode: ['', Validators.required],
      departmentName: ['', Validators.required],
      location: [''],
      description: [''],
      status: ['ACTIVO']
    });

    if (this.mode === 'edit' && this.department) {
      this.deptForm.patchValue({
        departmentCode: this.department.departmentCode,
        departmentName: this.department.departmentName,
        location: this.department.location,
        description: this.department.description || '',
        status: this.department.status
      });
    }
  }

  onSubmit(): void {
    if (this.deptForm.invalid) {
      this.deptForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.deptForm.value;

    if (this.mode === 'edit' && this.department) {
      this.departmentService.updateDepartment(this.department.id, formData).subscribe({
        next: () => {
          this.snackBar.open('Departamento actualizado', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.departmentService.createDepartment(formData).subscribe({
        next: () => {
          this.snackBar.open('Departamento creado', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al crear', 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}