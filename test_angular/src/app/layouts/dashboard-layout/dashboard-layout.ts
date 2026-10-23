
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { AuthUser } from '../../core/auth/auth.models';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal<AuthUser | null>(this.authService.currentUser());

  ngOnInit(): void {
    // Nếu user chưa có trong bộ nhớ, tải lại từ backend.
    if (!this.user()) {
      this.authService.getMe().subscribe({
        next: (user) => {
          this.user.set(user);
        },
        error: (error) => {
          console.error('Không tải được thông tin người dùng:', error);
        },
      });
    }
  }

  hasRole(...roles: string[]): boolean {
    const role = this.user()?.role;
    return !!role && roles.includes(role);
  }

  logout(): void {
  this.authService.logout();
  this.router.navigateByUrl('/login');
}
}
