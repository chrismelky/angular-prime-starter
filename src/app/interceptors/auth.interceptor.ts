import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor(
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService
  ) {
    console.log('contracted');
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('inetrcepting');

    return next.handle(req);
  }
}
