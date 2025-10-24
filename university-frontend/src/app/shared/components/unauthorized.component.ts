import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <div class="icon-container">
          <mat-icon color="warn">block</mat-icon>
        </div>
        <mat-card-header>
          <mat-card-title>Acceso Denegado</mat-card-title>
          <mat-card-subtitle>
            No tienes permisos para acceder a esta página
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>
            Lo sentimos, pero no tienes los permisos necesarios para ver este contenido.
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/dashboard">
            <mat-icon>home</mat-icon>
            Volver al Inicio
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .unauthorized-card {
      max-width: 500px;
      width: 100%;
      text-align: center;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .icon-container {
      margin-bottom: 24px;

      mat-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    }

    mat-card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 16px;
    }

    mat-card-title {
      font-size: 2rem;
      margin-bottom: 8px;
    }

    mat-card-content {
      margin-bottom: 24px;

      p {
        color: #666;
        line-height: 1.6;
      }
    }

    mat-card-actions {
      display: flex;
      justify-content: center;
      padding: 0;

      button {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  `]
})
export class UnauthorizedComponent {}