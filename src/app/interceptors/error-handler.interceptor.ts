import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastService } from '../shared/toast.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          if (error.status !== 401 && error.status !== 200) {
            let summary: string = 'Error';
            let detail;
            if (error.status === 422) {
              summary = `[${error.status}] ${error.error.message}`;
              detail = Object.values(error.error.errors).join('\n');
            } else {
              summary = `[${error.status}] ${error.statusText}`;
              detail = error.error.errors || error.error.message;
            }

            this.toastService.error(summary, detail);
          }
        },
      })
    );
  }
}
