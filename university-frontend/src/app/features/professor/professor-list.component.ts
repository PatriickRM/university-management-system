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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ProfessorService } from '../../core/services/professor.service';
import { Professor } from '../../core/models/professor.model';
import { AuthService } from '../../core/services/auth.service';
import { ProfessorFormDialogComponent } from './professor-form-dialog/professor-form-dialog.component';

@Component({
  selector: 'app-professor-list',
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
    MatDialogModule
  ],
  templateUrl: './professor-list.component.html',
  styleUrls: ['./professor-list.component.scss']
})
export class ProfessorListComponent implements OnInit {
  private professorService = inject(ProfessorService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = [
    'employeeCode',
    'fullName',
    'email',
    'department',
    'specialization',
    'employmentType',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Professor>();
  loading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  searchControl = new FormControl('');
  isAdmin = false;
  isProfessor = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.isProfessor = this.authService.hasRole('PROFESSOR');
    this.loadProfessors();
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilter();
      });
  }

  loadProfessors(): void {
    this.loading = true;
    
    if (this.isAdmin) {
      // Admin ve todos los profesores
      this.professorService.getProfessorsPaginated(this.pageIndex, this.pageSize).subscribe({
        next: (response) => {
          this.dataSource.data = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading professors:', error);
          this.loading = false;
          this.snackBar.open('Error al cargar profesores', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else if (this.isProfessor) {
      // Profesor solo ve su propia información
      this.professorService.getAllProfessors().subscribe({
        next: (professors) => {
          const currentUser = this.authService.getCurrentUser();
          const filtered = professors.filter(p => p.user.email === currentUser?.email);
          this.dataSource.data = filtered;
          this.totalElements = filtered.length;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading professor:', error);
          this.loading = false;
        }
      });
    }
  }

  applyFilter(): void {
    const filterValue = this.searchControl.value || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProfessors();
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'ACTIVO': 'primary',
      'INACTIVO': 'warn',
      'RETIRADO': 'warn'
    };
    return colors[status] || 'primary';
  }

  getEmploymentTypeColor(type: string): string {
    return type === 'FULL_TIME' ? 'accent' : 'primary';
  }

  getEmploymentTypeLabel(type: string): string {
    return type === 'FULL_TIME' ? 'Tiempo Completo' : 'Tiempo Parcial';
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProfessorFormDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true,
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProfessors();
      }
    });
  }

  openEditDialog(professor: Professor): void {
    const dialogRef = this.dialog.open(ProfessorFormDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true,
      data: { mode: 'edit', professor: professor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProfessors();
      }
    });
  }

  viewProfessor(professor: Professor): void {
    this.dialog.open(ProfessorFormDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { mode: 'view', professor: professor }
    });
  }

  deleteProfessor(professor: Professor): void {
    const fullName = `${professor.user.firstName} ${professor.user.lastName}`;
    
    if (confirm(`¿Estás seguro de que deseas eliminar al profesor ${fullName}?`)) {
      this.professorService.deleteProfessor(professor.id).subscribe({
        next: () => {
          this.snackBar.open('Profesor eliminado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadProfessors();
        },
        error: (error) => {
          console.error('Error deleting professor:', error);
          this.snackBar.open('Error al eliminar profesor', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getFullName(professor: Professor): string {
    return `${professor.user.firstName} ${professor.user.lastName}`;
  }
}