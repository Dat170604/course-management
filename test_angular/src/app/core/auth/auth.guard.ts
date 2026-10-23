import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = route.data['roles'] as
    | string[]
    | undefined;

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const user = authService.currentUser();

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (!allowedRoles.includes(user.role)) {
    return router.createUrlTree(['/forbidden']);
  }

  return true;
};