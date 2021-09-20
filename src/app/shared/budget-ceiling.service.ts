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
import {CustomResponse} from "../utils/custom-response";
import {createRequestOption} from "../utils/request-util";
import { BudgetCeilingModel } from './budget-ceiling.model';

@Injectable({ providedIn: "root" })
export class BudgetCeilingService {
  public resourceUrl = "api/budget_ceilings";

  constructor(protected http: HttpClient) {}

  create(
    adminHierarchyCeiling: any
  ): Observable<CustomResponse<BudgetCeilingModel>> {
    return this.http.post<CustomResponse<BudgetCeilingModel>>(
      this.resourceUrl,
      adminHierarchyCeiling
    );
  }

  update(
    adminHierarchyCeiling: any
  ): Observable<CustomResponse<any>> {
    return this.http.put<CustomResponse<any>>(
      `${this.resourceUrl}/${adminHierarchyCeiling.id}`,
      adminHierarchyCeiling
    );
  }

  find(id: number): Observable<CustomResponse<any>> {
    return this.http.get<CustomResponse<any>>(
      `${this.resourceUrl}/${id}`
    );
  }


  query(req?: any): Observable<CustomResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<any[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
