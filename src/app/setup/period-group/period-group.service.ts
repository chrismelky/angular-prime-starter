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
import { PeriodGroup } from "./period-group.model";

@Injectable({ providedIn: "root" })
export class PeriodGroupService {
  public resourceUrl = "api/period_groups";

  constructor(protected http: HttpClient) {}

  create(periodGroup: PeriodGroup): Observable<CustomResponse<PeriodGroup>> {
    return this.http.post<CustomResponse<PeriodGroup>>(
      this.resourceUrl,
      periodGroup
    );
  }

  update(periodGroup: PeriodGroup): Observable<CustomResponse<PeriodGroup>> {
    return this.http.put<CustomResponse<PeriodGroup>>(
      `${this.resourceUrl}/${periodGroup.id}`,
      periodGroup
    );
  }

  find(id: number): Observable<CustomResponse<PeriodGroup>> {
    return this.http.get<CustomResponse<PeriodGroup>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<PeriodGroup[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<PeriodGroup[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
