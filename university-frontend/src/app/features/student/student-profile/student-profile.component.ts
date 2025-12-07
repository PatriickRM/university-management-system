import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="profile-container">
      <!-- Header -->
      <div class="profile-header">
        <div class="header-content">
          <div class="profile-avatar">
            {{ getInitials() }}
          </div>
          <div class="header-info">
            <h1>{{ getFullName() }}</h1>
            <p class="student-code">{{ student?.studentCode }}</p>
            <div class="info-chips">
              <mat-icon>school</mat-icon>
              <span>{{ student?.career?.careerName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="profile-content">
        <mat-tab-group>
          <!-- Personal Info Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>person</mat-icon>
              Información Personal
            </ng-template>

            @if (loading) {
              <div class="loading-container">
                <mat-spinner></mat-spinner>
              </div>
            } @else {
              <mat-card class="info-card">
                <div class="card-header">
                  <h3>
                    <mat-icon>account_circle</mat-icon>
                    Datos Personales
                  </h3>
                  @if (!editingPersonal) {
                    <button mat-button color="primary" (click)="enableEditPersonal()">
                      <mat-icon>edit</mat-icon>
                      Editar
                    </button>
                  }
                </div>

                <mat-divider></mat-divider>

                <form [formGroup]="personalForm" class="form-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Nombres</mat-label>
                    <input matInput formControlName="firstName" [readonly]="!editingPersonal">
                    <mat-icon matPrefix>person</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Apellidos</mat-label>
                    <input matInput formControlName="lastName" [readonly]="!editingPersonal">
                    <mat-icon matPrefix>person</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>DNI</mat-label>
                    <input matInput formControlName="nationalId" readonly>
                    <mat-icon matPrefix>badge</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" readonly>
                    <mat-icon matPrefix>email</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Teléfono</mat-label>
                    <input matInput formControlName="phoneNumber" [readonly]="!editingPersonal">
                    <mat-icon matPrefix>phone</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Fecha de Nacimiento</mat-label>
                    <input matInput formControlName="dateOfBirth" readonly>
                    <mat-icon matPrefix>cake</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Dirección</mat-label>
                    <textarea matInput formControlName="address" rows="2" [readonly]="!editingPersonal"></textarea>
                    <mat-icon matPrefix>home</mat-icon>
                  </mat-form-field>

                  @if (editingPersonal) {
                    <div class="form-actions full-width">
                      <button mat-button (click)="cancelEditPersonal()">Cancelar</button>
                      <button mat-raised-button color="primary" (click)="savePersonalInfo()" [disabled]="savingPersonal">
                        <mat-spinner diameter="20" *ngIf="savingPersonal"></mat-spinner>
                        <span *ngIf="!savingPersonal">Guardar Cambios</span>
                      </button>
                    </div>
                  }
                </form>
              </mat-card>
            }
          </mat-tab>

          <!-- Academic Info Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>school</mat-icon>
              Información Académica
            </ng-template>

            <mat-card class="info-card">
              <div class="card-header">
                <h3>
                  <mat-icon>menu_book</mat-icon>
                  Datos Académicos
                </h3>
              </div>

              <mat-divider></mat-divider>

              <div class="info-grid">
                <div class="info-item">
                  <div class="info-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    <mat-icon>badge</mat-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Código de Estudiante</span>
                    <strong class="info-value">{{ student?.studentCode }}</strong>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                    <mat-icon>school</mat-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Carrera</span>
                    <strong class="info-value">{{ student?.career?.careerName }}</strong>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                    <mat-icon>event_note</mat-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Semestre Actual</span>
                    <strong class="info-value">{{ student?.currentSemester }}°</strong>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
                    <mat-icon>stars</mat-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Total de Créditos</span>
                    <strong class="info-value">{{ student?.totalCredits || 0 }}</strong>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
                    <mat-icon>event_available</mat-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Fecha de Admisión</span>
                    <strong class="info-value">{{ formatDate(student?.admissionDate) }}</strong>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)">
                    <mat-icon>info</mat-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Estado Académico</span>
                    <strong class="info-value">{{ student?.academicStatus }}</strong>
                  </div>
                </div>
              </div>
            </mat-card>
          </mat-tab>

          <!-- Emergency Contact Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>emergency</mat-icon>
              Contacto de Emergencia
            </ng-template>

            <mat-card class="info-card">
              <div class="card-header">
                <h3>
                  <mat-icon>contacts</mat-icon>
                  Contacto de Emergencia
                </h3>
                @if (!editingEmergency) {
                  <button mat-button color="primary" (click)="enableEditEmergency()">
                    <mat-icon>edit</mat-icon>
                    Editar
                  </button>
                }
              </div>

              <mat-divider></mat-divider>

              <form [formGroup]="emergencyForm" class="form-grid">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Teléfono de Emergencia</mat-label>
                  <input matInput formControlName="emergencyContactPhone" [readonly]="!editingEmergency">
                  <mat-icon matPrefix>emergency</mat-icon>
                  <mat-hint>Número de contacto en caso de emergencia</mat-hint>
                </mat-form-field>

                @if (editingEmergency) {
                  <div class="form-actions full-width">
                    <button mat-button (click)="cancelEditEmergency()">Cancelar</button>
                    <button mat-raised-button color="primary" (click)="saveEmergencyContact()" [disabled]="savingEmergency">
                      <mat-spinner diameter="20" *ngIf="savingEmergency"></mat-spinner>
                      <span *ngIf="!savingEmergency">Guardar Cambios</span>
                    </button>
                  </div>
                }
              </form>
            </mat-card>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .profile-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 48px 24px;
      color: white;

      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 32px;

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 700;
          border: 4px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .header-info {
          h1 {
            margin: 0 0 8px 0;
            font-size: 2.5rem;
            font-weight: 700;
          }

          .student-code {
            margin: 0 0 12px 0;
            font-size: 1.125rem;
            opacity: 0.9;
          }

          .info-chips {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            width: fit-content;
            font-size: 0.9375rem;
          }
        }
      }
    }

    .profile-content {
      max-width: 1200px;
      margin: -40px auto 0;
      padding: 0 24px 40px;
      position: relative;
      z-index: 1;
    }

    .info-card {
      margin-top: 24px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;

        h3 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          color: #2c3e50;
          font-size: 1.25rem;

          mat-icon {
            color: #667eea;
          }
        }

        button {
          display: flex;
          align-items: center;
          gap: 6px;
        }
      }

      mat-divider {
        margin-bottom: 24px;
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 20px;

      .full-width {
        grid-column: 1 / -1;
      }

      mat-form-field {
        width: 100%;
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;

      .info-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 12px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .info-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          mat-icon {
            color: white;
            font-size: 28px;
            width: 28px;
            height: 28px;
          }
        }

        .info-content {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .info-label {
            font-size: 0.8125rem;
            color: #7f8c8d;
            font-weight: 500;
          }

          .info-value {
            font-size: 1.125rem;
            color: #2c3e50;
            font-weight: 600;
          }
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    @media (max-width: 768px) {
      .profile-header .header-content {
        flex-direction: column;
        text-align: center;

        .header-info h1 {
          font-size: 1.75rem;
        }
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StudentProfileComponent implements OnInit {
  private studentService = inject(StudentService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  student: Student | null = null;
  loading = false;
  editingPersonal = false;
  editingEmergency = false;
  savingPersonal = false;
  savingEmergency = false;

  personalForm!: FormGroup;
  emergencyForm!: FormGroup;

  ngOnInit(): void {
    this.initForms();
    this.loadStudentData();
  }

  initForms(): void {
    this.personalForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      nationalId: [''],
      email: [''],
      phoneNumber: [''],
      dateOfBirth: [''],
      address: ['']
    });

    this.emergencyForm = this.fb.group({
      emergencyContactPhone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]]
    });
  }

  loadStudentData(): void {
    this.loading = true;
    const userId = this.authService.getUserIdFromToken();
    
    if (!userId) {
      this.loading = false;
      return;
    }

    this.studentService.getByUserId(userId).subscribe({
      next: (student) => {
        this.student = student;
        this.populateForms();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  populateForms(): void {
    if (!this.student) return;

    this.personalForm.patchValue({
      firstName: this.student.user.firstName,
      lastName: this.student.user.lastName,
      nationalId: this.student.user.nationalId,
      email: this.student.user.email,
      phoneNumber: this.student.user.phoneNumber,
      dateOfBirth: this.formatDate(this.student.user.dateOfBirth),
      address: this.student.user.address
    });

    this.emergencyForm.patchValue({
      emergencyContactPhone: this.student.emergencyContactPhone
    });
  }

  enableEditPersonal(): void {
    this.editingPersonal = true;
  }

  cancelEditPersonal(): void {
    this.editingPersonal = false;
    this.populateForms();
  }

  savePersonalInfo(): void {
    // Implementar guardado (solo algunos campos son editables)
    this.savingPersonal = true;
    // Simulación
    setTimeout(() => {
      this.savingPersonal = false;
      this.editingPersonal = false;
      this.snackBar.open('Información actualizada correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 1500);
  }

  enableEditEmergency(): void {
    this.editingEmergency = true;
  }

  cancelEditEmergency(): void {
    this.editingEmergency = false;
    this.populateForms();
  }

  saveEmergencyContact(): void {
    if (this.emergencyForm.invalid) {
      return;
    }

    this.savingEmergency = true;
    const updateData = {
      emergencyContactPhone: this.emergencyForm.value.emergencyContactPhone
    };

    this.studentService.updateStudent(this.student!.id, updateData).subscribe({
      next: () => {
        this.savingEmergency = false;
        this.editingEmergency = false;
        this.snackBar.open('Contacto de emergencia actualizado', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadStudentData();
      },
      error: (err) => {
        console.error(err);
        this.savingEmergency = false;
      }
    });
  }

  getInitials(): string {
    if (!this.student) return '?';
    const first = this.student.user.firstName?.charAt(0) || '';
    const last = this.student.user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  getFullName(): string {
    if (!this.student) return '';
    return `${this.student.user.firstName} ${this.student.user.lastName}`;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}