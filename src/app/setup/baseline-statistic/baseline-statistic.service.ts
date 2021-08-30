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
import { BaselineStatistic } from "./baseline-statistic.model";

@Injectable({ providedIn: "root" })
export class BaselineStatisticService {
  public resourceUrl = "api/baseline_statistics";

  constructor(protected http: HttpClient) {}

  create(
    baselineStatistic: BaselineStatistic
  ): Observable<CustomResponse<BaselineStatistic>> {
    return this.http.post<CustomResponse<BaselineStatistic>>(
      this.resourceUrl,
      baselineStatistic
    );
  }

  update(
    baselineStatistic: BaselineStatistic
  ): Observable<CustomResponse<BaselineStatistic>> {
    return this.http.put<CustomResponse<BaselineStatistic>>(
      `${this.resourceUrl}/${baselineStatistic.id}`,
      baselineStatistic
    );
  }

  find(id: number): Observable<CustomResponse<BaselineStatistic>> {
    return this.http.get<CustomResponse<BaselineStatistic>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<BaselineStatistic[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<BaselineStatistic[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
