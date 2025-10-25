// university-frontend/src/app/features/academic-period/period-form-dialog/period-form-dialog.component.ts
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
import { MatSnackBar } from '@angular/material/snack-bar';

import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { AcademicPeriod } from '../../../core/models/academic-period.model';

@Component({
  selector: 'app-period-form-dialog',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './period-form-dialog.component.html',
  styleUrls: ['./period-form-dialog.component.scss']
})
export class PeriodFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private periodService = inject(AcademicPeriodService);
  private snackBar = inject(MatSnackBar);

  periodForm!: FormGroup;
  loading = false;
  mode: 'create' | 'edit' = 'create';
  period?: AcademicPeriod;

  constructor(
    public dialogRef: MatDialogRef<PeriodFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode || 'create';
    this.period = data.period;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.mode === 'edit' && this.period) {
      this.loadPeriodData();
    }
  }

  initForm(): void {
    this.periodForm = this.fb.group({
      periodCode: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['NO_INICIADO']
    });
  }

  loadPeriodData(): void {
    if (!this.period) return;

    this.periodForm.patchValue({
      periodCode: this.period.periodCode,
      startDate: this.period.startDate,
      endDate: this.period.endDate,
      status: this.period.status
    });
  }

  calculateDuration(): number {
    const start = this.periodForm.get('startDate')?.value;
    const end = this.periodForm.get('endDate')?.value;
    
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  onSubmit(): void {
    if (this.periodForm.invalid) {
      this.periodForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const periodData = {
      ...this.periodForm.value,
      startDate: this.formatDate(this.periodForm.value.startDate),
      endDate: this.formatDate(this.periodForm.value.endDate)
    };

    if (this.mode === 'edit' && this.period) {
      this.periodService.updatePeriod(this.period.id, periodData).subscribe({
        next: () => {
          this.snackBar.open('Período actualizado', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
        }
      });
    } else {
      this.periodService.createPeriod(periodData).subscribe({
        next: () => {
          this.snackBar.open('Período creado', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
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
}