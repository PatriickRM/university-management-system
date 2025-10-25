import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    //Cargar usuario desde token al iniciar
    this.loadUserFromToken();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.loadUserFromToken();
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  getToken(): string | null {
  if (this.isBrowser()) {
    return localStorage.getItem('token');
      }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles.some(r => r.name === role) || false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;
    
    const payload = JSON.parse(atob(token.split('.')[1]));

    return typeof payload.userId === 'number' ? payload.userId : null;
  }


  private setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }

  private loadUserFromToken(): void {
    if (!this.isBrowser()) return;

    const token = this.getToken();
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      this.http.get<User>(`${this.apiUrl}/me`).subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
    } catch {
      this.logout();
    }
  }

}