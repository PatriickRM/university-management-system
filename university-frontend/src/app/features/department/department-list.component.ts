import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentService } from '../../core/services/department.service';
import { Department } from '../../core/models/professor.model';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-content">
          <h1>
            <mat-icon>business</mat-icon>
            Departamentos
          </h1>
          <p>Gestiona los departamentos de la universidad</p>
        </div>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Departamento
        </button>
      </div>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <div class="departments-grid">
          @for (dept of departments; track dept.id) {
            <mat-card class="department-card">
              <div class="card-header">
                <div class="dept-icon">
                  <mat-icon>business</mat-icon>
                </div>
                <mat-chip [color]="dept.status === 'ACTIVO' ? 'primary' : 'warn'" highlighted>
                  {{ dept.status }}
                </mat-chip>
              </div>

              <mat-card-content>
                <h3>{{ dept.departmentName }}</h3>
                <div class="dept-code">{{ dept.departmentCode }}</div>
                
                @if (dept.description) {
                  <p class="description">{{ dept.description }}</p>
                }

                <div class="dept-info">
                  <div class="info-row">
                    <mat-icon>location_on</mat-icon>
                    <span>{{ dept.location || 'Sin ubicación' }}</span>
                  </div>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="editDepartment(dept)">
                    <mat-icon>edit</mat-icon>
                    <span>Editar</span>
                  </button>
                  <button mat-menu-item (click)="deleteDepartment(dept)">
                    <mat-icon color="warn">delete</mat-icon>
                    <span>Eliminar</span>
                  </button>
                </mat-menu>
              </mat-card-actions>
            </mat-card>
          }
        </div>

        @if (departments.length === 0) {
          <div class="empty-state">
            <mat-icon>business</mat-icon>
            <h3>No hay departamentos</h3>
            <p>No se encontraron departamentos en el sistema</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;

      .header-content {
        h1 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 8px 0;
          color: #2c3e50;
          font-size: 2rem;

          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
            color: #667eea;
          }
        }

        p {
          margin: 0;
          color: #7f8c8d;
        }
      }

      button {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    .departments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .department-card {
      transition: all 0.3s ease;
      border-top: 4px solid #667eea;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .dept-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;

          mat-icon {
            font-size: 28px;
            width: 28px;
            height: 28px;
          }
        }
      }

      h3 {
        margin: 0 0 8px 0;
        font-size: 1.25rem;
        color: #2c3e50;
        font-weight: 600;
      }

      .dept-code {
        display: inline-block;
        padding: 4px 12px;
        background: #f0f0f0;
        border-radius: 6px;
        font-size: 0.8125rem;
        font-weight: 600;
        color: #7f8c8d;
        margin-bottom: 12px;
      }

      .description {
        margin: 12px 0;
        color: #64748b;
        font-size: 0.875rem;
        line-height: 1.5;
      }

      .dept-info {
        .info-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          color: #64748b;
          font-size: 0.9375rem;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            color: #667eea;
          }
        }
      }

      mat-card-actions {
        border-top: 1px solid #e0e0e0;
        padding: 8px 16px;
        display: flex;
        justify-content: flex-end;
      }
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      color: #7f8c8d;

      mat-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        margin-bottom: 16px;
        opacity: 0.3;
      }

      h3 {
        margin: 0 0 8px 0;
        font-size: 1.5rem;
        color: #2c3e50;
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;

        button {
          width: 100%;
          justify-content: center;
        }
      }

      .departments-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DepartmentListComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  departments: Department[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    import('./depart-form-dialog/department-form-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.DepartmentFormDialogComponent, {
        width: '600px',
        data: { mode: 'create' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadDepartments();
      });
    });
  }

  editDepartment(department: Department): void {
    import('./depart-form-dialog/department-form-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.DepartmentFormDialogComponent, {
        width: '600px',
        data: { mode: 'edit', department }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadDepartments();
      });
    });
  }

  deleteDepartment(department: Department): void {
    if (confirm(`¿Eliminar el departamento "${department.departmentName}"?`)) {
      this.departmentService.deleteDepartment(department.id).subscribe({
        next: () => {
          this.snackBar.open('Departamento eliminado', 'Cerrar', { duration: 3000 });
          this.loadDepartments();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}