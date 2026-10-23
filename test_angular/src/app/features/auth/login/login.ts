import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  loading = signal(false);
  error = signal('');

  private getDashboardPath(role: string): string {
    switch (role) {
      case 'STUDENT':
        return '/dashboard';

      case 'TEACHER':
        return '/dashboard';

      case 'ADMIN':
        return '/dashboard';

      default:
        return '/login';
    }
  }

  onSubmit(): void {
    if (!this.email.trim() || !this.password) {
      this.error.set('Vui lòng nhập email và mật khẩu');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        // Lấy user và role từ backend sau khi nhận token.
        this.authService.getMe().subscribe({
          next: (user) => {
          this.loading.set(false);

          this.router.navigateByUrl(
          this.getDashboardPath(user.role)
          );
        },
          error: () => {
            this.authService.clearSession();
            this.loading.set(false);
            this.error.set(
              'Đăng nhập thành công nhưng không lấy được thông tin tài khoản.'
            );
          }
        });
      },
      error: (err) => {
        this.loading.set(false);

        if (err.status === 401) {
          this.error.set('Email hoặc mật khẩu không chính xác');
        } else if (err.status === 429) {
          this.error.set('Bạn đăng nhập quá nhiều lần. Hãy thử lại sau.');
        } else {
          this.error.set('Không thể đăng nhập. Vui lòng thử lại.');
        }
      }
    });
  }
}