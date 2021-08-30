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
import { BaselineStatisticValue } from "./baseline-statistic-value.model";

@Injectable({ providedIn: "root" })
export class BaselineStatisticValueService {
  public resourceUrl = "api/baseline_statistic_values";

  constructor(protected http: HttpClient) {}

  create(
    baselineStatisticValue: BaselineStatisticValue
  ): Observable<CustomResponse<BaselineStatisticValue>> {
    return this.http.post<CustomResponse<BaselineStatisticValue>>(
      this.resourceUrl,
      baselineStatisticValue
    );
  }

  update(
    baselineStatisticValue: BaselineStatisticValue
  ): Observable<CustomResponse<BaselineStatisticValue>> {
    return this.http.put<CustomResponse<BaselineStatisticValue>>(
      `${this.resourceUrl}/${baselineStatisticValue.id}`,
      baselineStatisticValue
    );
  }

  find(id: number): Observable<CustomResponse<BaselineStatisticValue>> {
    return this.http.get<CustomResponse<BaselineStatisticValue>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<BaselineStatisticValue[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<BaselineStatisticValue[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
