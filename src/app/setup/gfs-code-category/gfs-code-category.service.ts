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
import { GfsCodeCategory } from "./gfs-code-category.model";

@Injectable({ providedIn: "root" })
export class GfsCodeCategoryService {
  public resourceUrl = "api/gfs_code_categories";

  constructor(protected http: HttpClient) {}

  create(
    gfsCodeCategory: GfsCodeCategory
  ): Observable<CustomResponse<GfsCodeCategory>> {
    return this.http.post<CustomResponse<GfsCodeCategory>>(
      this.resourceUrl,
      gfsCodeCategory
    );
  }

  update(
    gfsCodeCategory: GfsCodeCategory
  ): Observable<CustomResponse<GfsCodeCategory>> {
    return this.http.put<CustomResponse<GfsCodeCategory>>(
      `${this.resourceUrl}/${gfsCodeCategory.id}`,
      gfsCodeCategory
    );
  }

  find(id: number): Observable<CustomResponse<GfsCodeCategory>> {
    return this.http.get<CustomResponse<GfsCodeCategory>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<GfsCodeCategory[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<GfsCodeCategory[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
