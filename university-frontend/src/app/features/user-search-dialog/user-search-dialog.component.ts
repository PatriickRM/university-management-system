import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-search-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="search-dialog">
      <div class="dialog-header">
        <h2>
          <mat-icon>search</mat-icon>
          Buscar Usuario
        </h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por nombre, email o usuario</mat-label>
          <input matInput 
                 [formControl]="searchControl" 
                 placeholder="Ej: Juan Pérez, [email protected]"
                 autofocus>
          <mat-icon matPrefix>search</mat-icon>
          @if (searchControl.value) {
            <button mat-icon-button matSuffix (click)="clearSearch()">
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-form-field>

        @if (searching) {
          <div class="loading-state">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Buscando usuarios...</p>
          </div>
        } @else if (searchControl.value && searchResults.length === 0) {
          <div class="empty-state">
            <mat-icon>person_search</mat-icon>
            <p>No se encontraron usuarios</p>
            <small>Intenta con otro término de búsqueda</small>
          </div>
        } @else if (searchResults.length > 0) {
          <div class="results-container">
            <p class="results-count">
              {{ searchResults.length }} resultado(s) encontrado(s)
            </p>
            <mat-list class="user-list">
              @for (user of searchResults; track user.id) {
                <mat-list-item (click)="selectUser(user)" class="user-item">
                  <div class="user-avatar">
                    {{ getUserInitials(user) }}
                  </div>
                  <div class="user-info">
                    <div class="user-name">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
                    <div class="user-details">
                      <span class="user-email">{{ user.email }}</span>
                      <div class="user-roles">
                        @for (role of user.roles; track role.id) {
                          <mat-chip class="role-chip" [class]="getRoleClass(role.name)">
                            {{ getRoleLabel(role.name) }}
                          </mat-chip>
                        }
                      </div>
                    </div>
                  </div>
                  <mat-icon class="select-icon">chevron_right</mat-icon>
                </mat-list-item>
              }
            </mat-list>
          </div>
        } @else {
          <div class="initial-state">
            <mat-icon>person_add</mat-icon>
            <p>Inicia una nueva conversación</p>
            <small>Busca un usuario para enviarle un mensaje</small>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .search-dialog {
      width: 600px;
      max-width: 90vw;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e0e0e0;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 1.25rem;
        color: #2c3e50;

        mat-icon {
          color: #667eea;
        }
      }
    }

    .dialog-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }

    .loading-state,
    .empty-state,
    .initial-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      color: #7f8c8d;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        opacity: 0.3;
        color: #bdc3c7;
      }

      p {
        margin: 0 0 8px 0;
        font-size: 1rem;
        color: #2c3e50;
      }

      small {
        font-size: 0.875rem;
        color: #95a5a6;
      }
    }

    .results-container {
      .results-count {
        margin: 0 0 16px 0;
        font-size: 0.875rem;
        color: #7f8c8d;
        font-weight: 500;
      }
    }

    .user-list {
      padding: 0;

      .user-item {
        cursor: pointer;
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 8px;
        background: #f8f9fa;
        transition: all 0.2s ease;
        display: flex !important;
        align-items: center;
        gap: 16px;
        height: auto !important;

        &:hover {
          background: #e9ecef;
          transform: translateX(4px);
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          min-width: 0;

          .user-name {
            font-size: 1rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 6px;
          }

          .user-details {
            display: flex;
            flex-direction: column;
            gap: 6px;

            .user-email {
              font-size: 0.875rem;
              color: #64748b;
            }

            .user-roles {
              display: flex;
              gap: 6px;
              flex-wrap: wrap;

              .role-chip {
                min-height: 24px;
                font-size: 0.75rem;
                font-weight: 600;

                &.admin {
                  background: #667eea;
                  color: white;
                }

                &.professor {
                  background: #f093fb;
                  color: white;
                }

                &.student {
                  background: #4facfe;
                  color: white;
                }
              }
            }
          }
        }

        .select-icon {
          color: #cbd5e0;
          flex-shrink: 0;
        }
      }
    }

    @media (max-width: 768px) {
      .search-dialog {
        width: 100%;
        height: 100%;
        max-width: 100vw;
        max-height: 100vh;
      }
    }
  `]
})
export class UserSearchDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<UserSearchDialogComponent>);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  searchControl = new FormControl('');
  searchResults: User[] = [];
  searching = false;
  currentUserId: number | null = null;

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserIdFromToken();
    this.setupSearch();
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(query => {
          if (!query || query.trim().length < 2) {
            return of([]);
          }
          this.searching = true;
          return this.userService.searchUsers(query.trim());
        })
      )
      .subscribe({
        next: (users) => {
          // Filtrar el usuario actual de los resultados
          this.searchResults = users.filter(u => u.id !== this.currentUserId);
          this.searching = false;
        },
        error: (err) => {
          console.error('Error searching users:', err);
          this.searching = false;
        }
      });
  }

  selectUser(user: User): void {
    this.dialogRef.close(user);
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.searchResults = [];
  }

  close(): void {
    this.dialogRef.close();
  }

  getUserInitials(user: User): string {
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  }

  getRoleLabel(roleName: string): string {
    const labels: { [key: string]: string } = {
      'ADMIN': 'Admin',
      'PROFESSOR': 'Profesor',
      'STUDENT': 'Estudiante'
    };
    return labels[roleName] || roleName;
  }

  getRoleClass(roleName: string): string {
    return roleName.toLowerCase();
  }
}