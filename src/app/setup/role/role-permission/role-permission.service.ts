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
import {CreateRolePermission, RolePermission} from "./role-permission.model";

@Injectable({providedIn: "root"})
export class RolePermissionService {
  public resourceUrl = "api/role_permissions";

  constructor(protected http: HttpClient) {
  }

  create(
    rolePermission: RolePermission
  ): Observable<CustomResponse<RolePermission>> {
    return this.http.post<CustomResponse<RolePermission>>(
      this.resourceUrl,
      rolePermission
    );
  }

  assignMultiplePermissions(data: CreateRolePermission): Observable<CustomResponse<null>> {
    return this.http.post<CustomResponse<null>>(`${this.resourceUrl}/assignMultiplePermissions`, data);
  }

  update(
    rolePermission: RolePermission
  ): Observable<CustomResponse<RolePermission>> {
    return this.http.put<CustomResponse<RolePermission>>(
      `${this.resourceUrl}/${rolePermission.id}`,
      rolePermission
    );
  }

  find(id: number): Observable<CustomResponse<RolePermission>> {
    return this.http.get<CustomResponse<RolePermission>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<RolePermission[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<RolePermission[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  deleteAllPermissions(roleId: number | undefined): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/deleteAllPermissions/${roleId}`);
  }

  deleteByRoleAndPermission(roleId: number | undefined, permissionId: number | undefined): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/deleteByRoleAndPermission/${roleId}/${permissionId}`);
  }

  addAllPermissions(roleId: number | undefined): Observable<CustomResponse<null>> {
    return this.http.get<CustomResponse<null>>(`${this.resourceUrl}/addAllPermissions/${roleId}`);
  }
}
