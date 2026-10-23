
import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

// Chia sẻ trạng thái giữa các request đang chạy.
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();

  // Không tự gắn access token vào các request auth công khai.
  const isAuthRequest =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh') ||
    req.url.includes('/auth/token');

  const request = !isAuthRequest && accessToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        isAuthRequest
      ) {
        return throwError(() => error);
      }

      // Nếu đã có request refresh đang chạy, đợi token mới.
      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((token): token is string => token !== null),
          take(1),
          switchMap((newToken) =>
            next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              })
            )
          )
        );
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshAccessToken().pipe(
        switchMap((tokens) => {
          isRefreshing = false;
          refreshTokenSubject.next(tokens.access_token);

          return next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            })
          );
        }),
        catchError((refreshError: unknown) => {
          isRefreshing = false;
          refreshTokenSubject.next(null);

          authService.clearSession();
          router.navigateByUrl('/login');

          return throwError(() => refreshError);
        })
      );
    })
  );
};
