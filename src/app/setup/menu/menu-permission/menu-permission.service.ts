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

import { createRequestOption } from "../../../utils/request-util";
import { CustomResponse } from "../../../utils/custom-response";
import {CreateMenuPermission, MenuPermission} from "./menu-permission.model";

@Injectable({ providedIn: "root" })
export class MenuPermissionService {
  public resourceUrl = "api/menu_permissions";

  constructor(protected http: HttpClient) {}

  create(
    menuPermission: MenuPermission
  ): Observable<CustomResponse<MenuPermission>> {
    return this.http.post<CustomResponse<MenuPermission>>(
      this.resourceUrl,
      menuPermission
    );
  }

  update(
    menuPermission: MenuPermission
  ): Observable<CustomResponse<MenuPermission>> {
    return this.http.put<CustomResponse<MenuPermission>>(
      `${this.resourceUrl}/${menuPermission.id}`,
      menuPermission
    );
  }

  find(id: number): Observable<CustomResponse<MenuPermission>> {
    return this.http.get<CustomResponse<MenuPermission>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<MenuPermission[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<MenuPermission[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  assignMultiplePermissions(data: CreateMenuPermission): Observable<CustomResponse<null>> {
    return this.http.post<CustomResponse<null>>(`${this.resourceUrl}/assignMultiplePermissions`, data);
  }
}
