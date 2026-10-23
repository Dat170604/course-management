import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 0:
          console.error('Không kết nối được backend');
          break;

        case 401:
          console.error('Chưa xác thực hoặc token không hợp lệ');
          break;

        case 403:
          console.error('Bạn không có quyền thực hiện thao tác');
          break;

        case 404:
          console.error('Không tìm thấy tài nguyên');
          break;

        case 500:
          console.error('Lỗi máy chủ');
          break;
      }

      return throwError(() => error);
    })
  );
};