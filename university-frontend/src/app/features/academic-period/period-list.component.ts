import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AcademicPeriodService } from '../../core/services/academic-period.service';
import { AcademicPeriod } from '../../core/models/academic-period.model';
import { AuthService } from '../../core/services/auth.service';
import { PeriodFormDialogComponent } from './period-form-dialog/period-form-dialog.component';

@Component({
  selector: 'app-period-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './period-list.component.html',
  styleUrls: ['./period-list.component.scss']
  
})
export class PeriodListComponent implements OnInit {
  private periodService = inject(AcademicPeriodService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  periods: AcademicPeriod[] = [];
  loading = false;
  isAdmin = false;

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.loadPeriods();
  }

  loadPeriods(): void {
    this.loading = true;
    this.periodService.getAllPeriods().subscribe({
      next: (periods) => {
        this.periods = periods.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading periods:', error);
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'NO_INICIADO': 'warn',
      'ACTIVO': 'primary',
      'FINALIZADO': 'accent'
    };
    return colors[status] || 'primary';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  getDuration(period: AcademicPeriod): number {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PeriodFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadPeriods();
    });
  }

  openEditDialog(period: AcademicPeriod): void {
    const dialogRef = this.dialog.open(PeriodFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'edit', period }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadPeriods();
    });
  }

  deletePeriod(period: AcademicPeriod): void {
    if (confirm(`¿Eliminar el período ${period.periodCode}?`)) {
      this.periodService.deletePeriod(period.id).subscribe({
        next: () => {
          this.snackBar.open('Período eliminado', 'Cerrar', { duration: 3000 });
          this.loadPeriods();
        },
        error: (error) => console.error('Error:', error)
      });
    }
  }
}

