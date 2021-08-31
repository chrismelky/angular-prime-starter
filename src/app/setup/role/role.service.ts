/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { createRequestOption } from "../../utils/request-util";
import { CustomResponse } from "../../utils/custom-response";
import { Role } from "./role.model";

@Injectable({ providedIn: "root" })
export class RoleService {
  public resourceUrl = "api/roles";

  constructor(protected http: HttpClient) {}

  create(role: Role): Observable<CustomResponse<Role>> {
    return this.http.post<CustomResponse<Role>>(this.resourceUrl, role);
  }

  update(role: Role): Observable<CustomResponse<Role>> {
    return this.http.put<CustomResponse<Role>>(
      `${this.resourceUrl}/${role.id}`,
      role
    );
  }

  find(id: number): Observable<CustomResponse<Role>> {
    return this.http.get<CustomResponse<Role>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Role[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Role[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
