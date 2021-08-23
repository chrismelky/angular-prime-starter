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
import { CategoryOption } from "./category-option.model";

@Injectable({ providedIn: "root" })
export class CategoryOptionService {
  public resourceUrl = "api/category_options";

  constructor(protected http: HttpClient) {}

  create(
    categoryOption: CategoryOption
  ): Observable<CustomResponse<CategoryOption>> {
    return this.http.post<CustomResponse<CategoryOption>>(
      this.resourceUrl,
      categoryOption
    );
  }

  update(
    categoryOption: CategoryOption
  ): Observable<CustomResponse<CategoryOption>> {
    return this.http.put<CustomResponse<CategoryOption>>(
      `${this.resourceUrl}/${categoryOption.id}`,
      categoryOption
    );
  }

  find(id: number): Observable<CustomResponse<CategoryOption>> {
    return this.http.get<CustomResponse<CategoryOption>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CategoryOption[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CategoryOption[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
