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
import { Scrutinization } from "./scrutinization.model";

@Injectable({ providedIn: "root" })
export class ScrutinizationService {
  public resourceUrl = "api/scrutinizations";

  constructor(protected http: HttpClient) {}

  create(
    scrutinization: Scrutinization
  ): Observable<CustomResponse<Scrutinization>> {
    return this.http.post<CustomResponse<Scrutinization>>(
      this.resourceUrl,
      scrutinization
    );
  }

  update(
    scrutinization: Scrutinization
  ): Observable<CustomResponse<Scrutinization>> {
    return this.http.put<CustomResponse<Scrutinization>>(
      `${this.resourceUrl}/${scrutinization.id}`,
      scrutinization
    );
  }

  find(id: number): Observable<CustomResponse<Scrutinization>> {
    return this.http.get<CustomResponse<Scrutinization>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<Scrutinization[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Scrutinization[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
