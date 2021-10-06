/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {createRequestOption} from '../../utils/request-util';
import {CustomResponse} from '../../utils/custom-response';
import {User} from './user.model';
import {LocalStorageService} from 'ngx-webstorage';
import {PasswordReset} from "./password-reset/password-reset";

@Injectable({providedIn: 'root'})
export class UserService {
  public resourceUrl = 'api/users';

  constructor(
    protected http: HttpClient,
    protected $localStorageService: LocalStorageService
  ) {
  }

  create(user: User): Observable<CustomResponse<User>> {
    return this.http.post<CustomResponse<User>>(this.resourceUrl, user);
  }

  update(user: User): Observable<CustomResponse<User>> {
    return this.http.put<CustomResponse<User>>(
      `${this.resourceUrl}/${user.id}`,
      user
    );
  }

  public passwordReset(passwordReset: PasswordReset): Observable<CustomResponse<User>> {
    return this.http.post(this.resourceUrl + '/passwordReset', passwordReset) as Observable<CustomResponse<User>>;
  }


  find(id: number): Observable<CustomResponse<User>> {
    return this.http.get<CustomResponse<User>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<User[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<User[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  getCurrentUser(): User {
    return this.$localStorageService.retrieve('user');
  }

  filterByAdminHierarchyIdAndPosition(req?: any): Observable<CustomResponse<User[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<User[]>>(`${this.resourceUrl}/filterByAdminHierarchyIdAndPosition`, {
      params: options,
    });
  }
}
