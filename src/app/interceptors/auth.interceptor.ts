import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url || request.url.startsWith('http')) {
      return next.handle(request);
    }
    if (request.url.includes('api')) {
      request = request.clone({
        setHeaders: {
          Accept: 'application/json',
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          Accept: 'text/html',
        },
      });
    }
    const token: string | null =
      this.localStorage.retrieve('authenticationToken') ??
      this.sessionStorage.retrieve('authenticationToken');
    if (token && request.url.includes('api')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }
}
