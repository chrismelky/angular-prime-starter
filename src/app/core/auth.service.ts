import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { Login } from 'src/app/login/login.model';
import { CustomResponse } from 'coverage/planrep-frontend/src/app/utils/custom-response';

type LoginRespose = {
  token: string;
  user: any;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService
  ) {}

  getToken(): string {
    const tokenInLocalStorage: string | null = this.$localStorage.retrieve(
      'authenticationToken'
    );
    const tokenInSessionStorage: string | null = this.$sessionStorage.retrieve(
      'authenticationToken'
    );
    return tokenInLocalStorage ?? tokenInSessionStorage ?? '';
  }

  login(credentials: Login): Observable<void> {
    return this.http
      .post<CustomResponse<LoginRespose>>('api/authenticate', credentials)
      .pipe(
        map((response) =>
          this.authenticateSuccess(response.data!, credentials.rememberMe)
        )
      );
  }

  logout(): Observable<void> {
    return new Observable((observer) => {
      this.$localStorage.clear('authenticationToken');
      this.$sessionStorage.clear('authenticationToken');
      observer.complete();
    });
  }

  private authenticateSuccess(
    response: LoginRespose,
    rememberMe: boolean
  ): void {
    const token = response.token;
    const user = response.user;
    this.$localStorage.store('user', user);

    if (rememberMe) {
      this.$localStorage.store('authenticationToken', token);
      this.$sessionStorage.clear('authenticationToken');
    } else {
      this.$sessionStorage.store('authenticationToken', token);
      this.$localStorage.clear('authenticationToken');
    }
  }
}
