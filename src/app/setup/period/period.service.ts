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
import { Period } from "./period.model";

@Injectable({ providedIn: "root" })
export class PeriodService {
  public resourceUrl = "api/periods";

  constructor(protected http: HttpClient) {}

  create(period: Period): Observable<CustomResponse<Period>> {
    return this.http.post<CustomResponse<Period>>(this.resourceUrl, period);
  }

  update(period: Period): Observable<CustomResponse<Period>> {
    return this.http.put<CustomResponse<Period>>(
      `${this.resourceUrl}/${period.id}`,
      period
    );
  }

  find(id: number): Observable<CustomResponse<Period>> {
    return this.http.get<CustomResponse<Period>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Period[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Period[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
