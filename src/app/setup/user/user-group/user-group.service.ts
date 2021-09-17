/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {createRequestOption} from "../../../utils/request-util";
import {CustomResponse} from "../../../utils/custom-response";
import {CreateUserGroup, UserGroup} from "./user-group.model";

@Injectable({providedIn: "root"})
export class UserGroupService {
  public resourceUrl = "api/user_groups";

  constructor(protected http: HttpClient) {
  }

  create(userGroup: UserGroup): Observable<CustomResponse<UserGroup>> {
    return this.http.post<CustomResponse<UserGroup>>(
      this.resourceUrl,
      userGroup
    );
  }

  update(userGroup: UserGroup): Observable<CustomResponse<UserGroup>> {
    return this.http.put<CustomResponse<UserGroup>>(
      `${this.resourceUrl}/${userGroup.id}`,
      userGroup
    );
  }

  find(id: number): Observable<CustomResponse<UserGroup>> {
    return this.http.get<CustomResponse<UserGroup>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<UserGroup[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<UserGroup[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  assignMultipleGroups(data: CreateUserGroup): Observable<CustomResponse<null>> {
    return this.http.post<CustomResponse<null>>(`${this.resourceUrl}/assignMultipleGroups`, data);
  }
}
