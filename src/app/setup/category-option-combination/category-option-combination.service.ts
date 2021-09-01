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
import { CategoryOptionCombination } from "./category-option-combination.model";

@Injectable({ providedIn: "root" })
export class CategoryOptionCombinationService {
  public resourceUrl = "api/category_option_combinations";

  constructor(protected http: HttpClient) {}

  create(
    categoryOptionCombination: CategoryOptionCombination
  ): Observable<CustomResponse<CategoryOptionCombination>> {
    return this.http.post<CustomResponse<CategoryOptionCombination>>(
      this.resourceUrl,
      categoryOptionCombination
    );
  }

  update(
    categoryOptionCombination: CategoryOptionCombination
  ): Observable<CustomResponse<CategoryOptionCombination>> {
    return this.http.put<CustomResponse<CategoryOptionCombination>>(
      `${this.resourceUrl}/${categoryOptionCombination.id}`,
      categoryOptionCombination
    );
  }

  find(id: number): Observable<CustomResponse<CategoryOptionCombination>> {
    return this.http.get<CustomResponse<CategoryOptionCombination>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CategoryOptionCombination[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CategoryOptionCombination[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
