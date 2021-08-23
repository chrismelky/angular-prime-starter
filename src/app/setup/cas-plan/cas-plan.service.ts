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
import { CasPlan } from "./cas-plan.model";

@Injectable({ providedIn: "root" })
export class CasPlanService {
  public resourceUrl = "api/cas_plans";

  constructor(protected http: HttpClient) {}

  create(casPlan: CasPlan): Observable<CustomResponse<CasPlan>> {
    return this.http.post<CustomResponse<CasPlan>>(this.resourceUrl, casPlan);
  }

  update(casPlan: CasPlan): Observable<CustomResponse<CasPlan>> {
    return this.http.put<CustomResponse<CasPlan>>(
      `${this.resourceUrl}/${casPlan.id}`,
      casPlan
    );
  }

  find(id: number): Observable<CustomResponse<CasPlan>> {
    return this.http.get<CustomResponse<CasPlan>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<CasPlan[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasPlan[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
