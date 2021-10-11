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
import { Intervention } from "./intervention.model";

@Injectable({ providedIn: "root" })
export class InterventionService {
  public resourceUrl = "api/interventions";

  constructor(protected http: HttpClient) {}

  create(intervention: Intervention): Observable<CustomResponse<Intervention>> {
    return this.http.post<CustomResponse<Intervention>>(
      this.resourceUrl,
      intervention
    );
  }

  update(intervention: Intervention): Observable<CustomResponse<Intervention>> {
    return this.http.put<CustomResponse<Intervention>>(
      `${this.resourceUrl}/${intervention.id}`,
      intervention
    );
  }

  find(id: number): Observable<CustomResponse<Intervention>> {
    return this.http.get<CustomResponse<Intervention>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<Intervention[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Intervention[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
