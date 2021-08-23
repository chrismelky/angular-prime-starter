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
import { CategoryCategoryOption } from "./category-category-option.model";

@Injectable({ providedIn: "root" })
export class CategoryCategoryOptionService {
  public resourceUrl = "api/category_category_options";

  constructor(protected http: HttpClient) {}

  create(
    categoryCategoryOption: CategoryCategoryOption
  ): Observable<CustomResponse<CategoryCategoryOption>> {
    return this.http.post<CustomResponse<CategoryCategoryOption>>(
      this.resourceUrl,
      categoryCategoryOption
    );
  }

  update(
    categoryCategoryOption: CategoryCategoryOption
  ): Observable<CustomResponse<CategoryCategoryOption>> {
    return this.http.put<CustomResponse<CategoryCategoryOption>>(
      `${this.resourceUrl}/${categoryCategoryOption.id}`,
      categoryCategoryOption
    );
  }

  find(id: number): Observable<CustomResponse<CategoryCategoryOption>> {
    return this.http.get<CustomResponse<CategoryCategoryOption>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CategoryCategoryOption[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CategoryCategoryOption[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
