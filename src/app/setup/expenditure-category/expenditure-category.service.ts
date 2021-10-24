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
import { ExpenditureCategory } from "./expenditure-category.model";

@Injectable({ providedIn: "root" })
export class ExpenditureCategoryService {
  public resourceUrl = "api/expenditure_categories";

  constructor(protected http: HttpClient) {}

  create(
    expenditureCategory: ExpenditureCategory
  ): Observable<CustomResponse<ExpenditureCategory>> {
    return this.http.post<CustomResponse<ExpenditureCategory>>(
      this.resourceUrl,
      expenditureCategory
    );
  }

  update(
    expenditureCategory: ExpenditureCategory
  ): Observable<CustomResponse<ExpenditureCategory>> {
    return this.http.put<CustomResponse<ExpenditureCategory>>(
      `${this.resourceUrl}/${expenditureCategory.id}`,
      expenditureCategory
    );
  }

  find(id: number): Observable<CustomResponse<ExpenditureCategory>> {
    return this.http.get<CustomResponse<ExpenditureCategory>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ExpenditureCategory[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ExpenditureCategory[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
