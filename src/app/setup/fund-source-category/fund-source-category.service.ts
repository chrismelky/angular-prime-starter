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
import { FundSourceCategory } from "./fund-source-category.model";

@Injectable({ providedIn: "root" })
export class FundSourceCategoryService {
  public resourceUrl = "api/fund_source_categories";

  constructor(protected http: HttpClient) {}

  create(
    fundSourceCategory: FundSourceCategory
  ): Observable<CustomResponse<FundSourceCategory>> {
    return this.http.post<CustomResponse<FundSourceCategory>>(
      this.resourceUrl,
      fundSourceCategory
    );
  }

  update(
    fundSourceCategory: FundSourceCategory
  ): Observable<CustomResponse<FundSourceCategory>> {
    return this.http.put<CustomResponse<FundSourceCategory>>(
      `${this.resourceUrl}/${fundSourceCategory.id}`,
      fundSourceCategory
    );
  }

  find(id: number): Observable<CustomResponse<FundSourceCategory>> {
    return this.http.get<CustomResponse<FundSourceCategory>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FundSourceCategory[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FundSourceCategory[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
