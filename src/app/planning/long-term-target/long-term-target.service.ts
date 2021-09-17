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
import { LongTermTarget } from "./long-term-target.model";

@Injectable({ providedIn: "root" })
export class LongTermTargetService {
  public resourceUrl = "api/long_term_targets";

  constructor(protected http: HttpClient) {}

  create(
    longTermTarget: LongTermTarget
  ): Observable<CustomResponse<LongTermTarget>> {
    return this.http.post<CustomResponse<LongTermTarget>>(
      this.resourceUrl,
      longTermTarget
    );
  }

  update(
    longTermTarget: LongTermTarget
  ): Observable<CustomResponse<LongTermTarget>> {
    return this.http.put<CustomResponse<LongTermTarget>>(
      `${this.resourceUrl}/${longTermTarget.id}`,
      longTermTarget
    );
  }

  find(id: number): Observable<CustomResponse<LongTermTarget>> {
    return this.http.get<CustomResponse<LongTermTarget>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<LongTermTarget[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<LongTermTarget[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
