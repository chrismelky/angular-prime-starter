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
import { CategoryCategoryCombination } from "./category-category-combination.model";

@Injectable({ providedIn: "root" })
export class CategoryCategoryCombinationService {
  public resourceUrl = "api/category_category_combinations";

  constructor(protected http: HttpClient) {}

  create(
    categoryCategoryCombination: CategoryCategoryCombination
  ): Observable<CustomResponse<CategoryCategoryCombination>> {
    return this.http.post<CustomResponse<CategoryCategoryCombination>>(
      this.resourceUrl,
      categoryCategoryCombination
    );
  }

  update(
    categoryCategoryCombination: CategoryCategoryCombination
  ): Observable<CustomResponse<CategoryCategoryCombination>> {
    return this.http.put<CustomResponse<CategoryCategoryCombination>>(
      `${this.resourceUrl}/${categoryCategoryCombination.id}`,
      categoryCategoryCombination
    );
  }

  find(id: number): Observable<CustomResponse<CategoryCategoryCombination>> {
    return this.http.get<CustomResponse<CategoryCategoryCombination>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CategoryCategoryCombination[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CategoryCategoryCombination[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
