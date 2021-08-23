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
import { CasAssessmentState } from "./cas-assessment-state.model";

@Injectable({ providedIn: "root" })
export class CasAssessmentStateService {
  public resourceUrl = "api/states";

  constructor(protected http: HttpClient) {}

  create(
    casAssessmentState: CasAssessmentState
  ): Observable<CustomResponse<CasAssessmentState>> {
    return this.http.post<CustomResponse<CasAssessmentState>>(
      this.resourceUrl,
      casAssessmentState
    );
  }

  update(
    casAssessmentState: CasAssessmentState
  ): Observable<CustomResponse<CasAssessmentState>> {
    return this.http.put<CustomResponse<CasAssessmentState>>(
      `${this.resourceUrl}/${casAssessmentState.id}`,
      casAssessmentState
    );
  }

  find(id: number): Observable<CustomResponse<CasAssessmentState>> {
    return this.http.get<CustomResponse<CasAssessmentState>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CasAssessmentState[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasAssessmentState[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}