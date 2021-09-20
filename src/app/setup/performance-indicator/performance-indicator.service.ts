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
import { PerformanceIndicator } from "./performance-indicator.model";

@Injectable({ providedIn: "root" })
export class PerformanceIndicatorService {
  public resourceUrl = "api/performance_indicators";

  constructor(protected http: HttpClient) {}

  create(
    performanceIndicator: PerformanceIndicator
  ): Observable<CustomResponse<PerformanceIndicator>> {
    return this.http.post<CustomResponse<PerformanceIndicator>>(
      this.resourceUrl,
      performanceIndicator
    );
  }

  update(
    performanceIndicator: PerformanceIndicator
  ): Observable<CustomResponse<PerformanceIndicator>> {
    return this.http.put<CustomResponse<PerformanceIndicator>>(
      `${this.resourceUrl}/${performanceIndicator.id}`,
      performanceIndicator
    );
  }

  find(id: number): Observable<CustomResponse<PerformanceIndicator>> {
    return this.http.get<CustomResponse<PerformanceIndicator>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<PerformanceIndicator[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<PerformanceIndicator[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
