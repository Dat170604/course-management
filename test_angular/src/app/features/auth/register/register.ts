
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (
      !this.username.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage.set('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage.set('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Mật khẩu xác nhận không khớp.');
      return;
    }

    this.loading.set(true);

    this.authService.register({
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set(
          'Đăng ký thành công! Đang chuyển đến trang đăng nhập...'
        );

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (error) => {
        this.loading.set(false);

        const detail = error?.error?.detail;

        if (typeof detail === 'string') {
          this.errorMessage.set(detail);
        } else if (Array.isArray(detail)) {
          this.errorMessage.set(
            detail.map((item) => item.msg).join(', ')
          );
        } else {
          this.errorMessage.set(
            'Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.'
          );
        }
      },
    });
  }
}
