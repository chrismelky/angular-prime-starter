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

import {createRequestOption} from "../../utils/request-util";
import {CustomResponse} from "../../utils/custom-response";
import {AllPermissionAndAssigned, Permission} from "./permission.model";

@Injectable({providedIn: "root"})
export class PermissionService {
  public resourceUrl = "api/permissions";

  constructor(protected http: HttpClient) {
  }

  create(permission: Permission): Observable<CustomResponse<Permission>> {
    return this.http.post<CustomResponse<Permission>>(
      this.resourceUrl,
      permission
    );
  }

  update(permission: Permission): Observable<CustomResponse<Permission>> {
    return this.http.put<CustomResponse<Permission>>(
      `${this.resourceUrl}/${permission.id}`,
      permission
    );
  }

  find(id: number): Observable<CustomResponse<Permission>> {
    return this.http.get<CustomResponse<Permission>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<Permission[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Permission[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
