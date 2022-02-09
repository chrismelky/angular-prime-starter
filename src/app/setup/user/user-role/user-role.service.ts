/**  * @license */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { createRequestOption } from '../../../utils/request-util';
import { CustomResponse } from '../../../utils/custom-response';
import { CreateUserRole, UserRole } from './user-role.model';

@Injectable({ providedIn: 'root' })
export class UserRoleService {
  public resourceUrl = 'api/user_roles';

  constructor(protected http: HttpClient) {}

  create(userRole: UserRole): Observable<CustomResponse<UserRole>> {
    return this.http.post<CustomResponse<UserRole>>(this.resourceUrl, userRole);
  }

  assignMultipleRoles(data: CreateUserRole): Observable<CustomResponse<null>> {
    return this.http.post<CustomResponse<null>>(
      `${this.resourceUrl}/assignMultipleRoles`,
      data
    );
  }

  update(userRole: UserRole): Observable<CustomResponse<UserRole>> {
    return this.http.put<CustomResponse<UserRole>>(
      `${this.resourceUrl}/${userRole.id}`,
      userRole
    );
  }

  find(id: number): Observable<CustomResponse<UserRole>> {
    return this.http.get<CustomResponse<UserRole>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<UserRole[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<UserRole[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
