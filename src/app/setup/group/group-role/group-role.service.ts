/**  * @license */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { createRequestOption } from '../../../utils/request-util';
import { CustomResponse } from '../../../utils/custom-response';
import { CreateGroupRole, GroupRole } from './group-role.model';
import { CreateUserGroup } from '../../user/user-group/user-group.model';

@Injectable({ providedIn: 'root' })
export class GroupRoleService {
  public resourceUrl = 'api/group_roles';

  constructor(protected http: HttpClient) {}

  create(groupRole: GroupRole): Observable<CustomResponse<GroupRole>> {
    return this.http.post<CustomResponse<GroupRole>>(
      this.resourceUrl,
      groupRole
    );
  }

  update(groupRole: GroupRole): Observable<CustomResponse<GroupRole>> {
    return this.http.put<CustomResponse<GroupRole>>(
      `${this.resourceUrl}/${groupRole.id}`,
      groupRole
    );
  }

  find(id: number): Observable<CustomResponse<GroupRole>> {
    return this.http.get<CustomResponse<GroupRole>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<GroupRole[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<GroupRole[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  assignMultipleRoles(data: CreateGroupRole): Observable<CustomResponse<null>> {
    return this.http.post<CustomResponse<null>>(
      `${this.resourceUrl}/assignMultipleRoles`,
      data
    );
  }
}
