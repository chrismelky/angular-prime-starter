import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { Login } from 'src/app/login/login.model';
import { StateStorageService } from './state-storage.service';
import { CustomResponse } from '../utils/custom-response';
import { NgxPermissionsService } from 'ngx-permissions';
import { MenuItem } from 'primeng/api';

type LoginResponse = {
  token: string;
  user: any;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService,
    private stateService: StateStorageService,
    private permissionsService: NgxPermissionsService
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
      .post<CustomResponse<LoginResponse>>('api/authenticate', credentials)
      .pipe(
        map((response) =>
          this.authenticateSuccess(response.data!, credentials.rememberMe)
        )
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<any>('api/logout', {})
      .pipe(map((response) => this.clearAuth()));
  }

  clearAuth(): void {
    this.$localStorage.clear('authenticationToken');
    this.$localStorage.clear('previousUrl');
    this.$sessionStorage.clear('authenticationToken');
    this.$sessionStorage.clear('previousUrl');
    this.permissionsService.flushPermissions();
    this.stateService.clearUrl();
  }

  private authenticateSuccess(
    response: LoginResponse,
    rememberMe: boolean
  ): void {
    const token = response.token;
    const user = response.user;
    this.$localStorage.store('user', user);
    this.permissionsService.loadPermissions(user.permissions);
    if (rememberMe) {
      this.$localStorage.store('authenticationToken', token);
      this.$sessionStorage.clear('authenticationToken');
    } else {
      this.$sessionStorage.store('authenticationToken', token);
      this.$localStorage.clear('authenticationToken');
    }
  }

  currentUserMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>('api/currentUserMenu');
  }
}
