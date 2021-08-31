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
import { BudgetClass } from "./budget-class.model";

@Injectable({ providedIn: "root" })
export class BudgetClassService {
  public resourceUrl = "api/budget_classes";

  constructor(protected http: HttpClient) {}

  create(budgetClass: BudgetClass): Observable<CustomResponse<BudgetClass>> {
    return this.http.post<CustomResponse<BudgetClass>>(
      this.resourceUrl,
      budgetClass
    );
  }

  update(budgetClass: BudgetClass): Observable<CustomResponse<BudgetClass>> {
    return this.http.put<CustomResponse<BudgetClass>>(
      `${this.resourceUrl}/${budgetClass.id}`,
      budgetClass
    );
  }

  find(id: number): Observable<CustomResponse<BudgetClass>> {
    return this.http.get<CustomResponse<BudgetClass>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<BudgetClass[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<BudgetClass[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
