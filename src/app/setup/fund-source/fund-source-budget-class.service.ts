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
import { FundSource } from "./fund-source.model";
import {GfsCode} from "../gfs-code/gfs-code.model";

@Injectable({ providedIn: "root" })
export class FundSourceBudgetClassService {
  public resourceUrl = "api/fund_source_budget_classes";

  constructor(protected http: HttpClient) {}

  create(fundSourceBudgetClass: any): Observable<CustomResponse<any>> {
    return this.http.post<CustomResponse<any>>(
      this.resourceUrl,
      fundSourceBudgetClass
    );
  }

  query(req?: any): Observable<CustomResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FundSource[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
