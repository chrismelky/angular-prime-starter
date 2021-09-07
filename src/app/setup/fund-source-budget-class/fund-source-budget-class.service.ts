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
import { FundSourceBudgetClass } from "./fund-source-budget-class.model";

@Injectable({ providedIn: "root" })
export class FundSourceBudgetClassService {
  public resourceUrl = "api/fund_source_budget_classes";

  constructor(protected http: HttpClient) {}

  create(
    fundSourceBudgetClass: FundSourceBudgetClass
  ): Observable<CustomResponse<FundSourceBudgetClass>> {
    return this.http.post<CustomResponse<FundSourceBudgetClass>>(
      this.resourceUrl,
      fundSourceBudgetClass
    );
  }

  update(
    fundSourceBudgetClass: FundSourceBudgetClass
  ): Observable<CustomResponse<FundSourceBudgetClass>> {
    return this.http.put<CustomResponse<FundSourceBudgetClass>>(
      `${this.resourceUrl}/${fundSourceBudgetClass.id}`,
      fundSourceBudgetClass
    );
  }

  find(id: number): Observable<CustomResponse<FundSourceBudgetClass>> {
    return this.http.get<CustomResponse<FundSourceBudgetClass>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FundSourceBudgetClass[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FundSourceBudgetClass[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
