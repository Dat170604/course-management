
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { AuthUser } from '../../core/auth/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);

  user = signal<AuthUser | null>(this.authService.currentUser());

  ngOnInit(): void {
    if (!this.user()) {
      this.authService.getMe().subscribe({
        next: (user) => this.user.set(user),
        error: (error) =>
          console.error('Không tải được thông tin người dùng:', error),
      });
    }
  }
}
