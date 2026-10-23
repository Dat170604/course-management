import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  TokenResponse
} from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8000/auth';

  currentUser = signal<AuthUser | null>(null);

  constructor(private http: HttpClient) {}

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  login(data: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        tap((tokens) => {
          localStorage.setItem(
            'access_token',
            tokens.access_token
          );

          localStorage.setItem(
            'refresh_token',
            tokens.refresh_token
          );
        })
      );
  }

  register(data: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`,data);
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();

    // Xóa trạng thái phía client ngay cả khi API logout lỗi.
    this.clearSession();

    if (refreshToken) {
      this.http.post(
        `${this.apiUrl}/logout`,
        { refresh_token: refreshToken }
      ).subscribe({
        error: (error) => {
          console.error('Logout API failed', error);
        }
      });
    }
  }

  clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser();

    return !!user && roles.includes(user.role);
  }

  getMe(): Observable<AuthUser> {
  return this.http
    .get<AuthUser>('http://localhost:8000/auth/me')
    .pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  
refreshAccessToken(): Observable<TokenResponse> {
  const refreshToken = this.getRefreshToken();

  if (!refreshToken) {
    throw new Error('Không tìm thấy refresh token');
  }

  return this.http
    .post<TokenResponse>(`${this.apiUrl}/refresh`, {
      refresh_token: refreshToken,
    })
    .pipe(
      tap((tokens) => {
        localStorage.setItem('access_token', tokens.access_token);

        // Nếu backend dùng refresh token rotation,
        // lưu refresh token mới khi response có trả về.
        if (tokens.refresh_token) {
          localStorage.setItem('refresh_token', tokens.refresh_token);
        }
      })
    );
}

}



