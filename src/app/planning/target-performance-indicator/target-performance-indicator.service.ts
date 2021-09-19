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
import { TargetPerformanceIndicator } from "./target-performance-indicator.model";

@Injectable({ providedIn: "root" })
export class TargetPerformanceIndicatorService {
  public resourceUrl = "api/target_performance_indicators";

  constructor(protected http: HttpClient) {}

  create(
    targetPerformanceIndicator: TargetPerformanceIndicator
  ): Observable<CustomResponse<TargetPerformanceIndicator>> {
    return this.http.post<CustomResponse<TargetPerformanceIndicator>>(
      this.resourceUrl,
      targetPerformanceIndicator
    );
  }

  update(
    targetPerformanceIndicator: TargetPerformanceIndicator
  ): Observable<CustomResponse<TargetPerformanceIndicator>> {
    return this.http.put<CustomResponse<TargetPerformanceIndicator>>(
      `${this.resourceUrl}/${targetPerformanceIndicator.id}`,
      targetPerformanceIndicator
    );
  }

  find(id: number): Observable<CustomResponse<TargetPerformanceIndicator>> {
    return this.http.get<CustomResponse<TargetPerformanceIndicator>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<TargetPerformanceIndicator[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<TargetPerformanceIndicator[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
