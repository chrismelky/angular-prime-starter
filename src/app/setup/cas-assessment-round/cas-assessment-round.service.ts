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
import { CasAssessmentRound } from "./cas-assessment-round.model";

@Injectable({ providedIn: "root" })
export class CasAssessmentRoundService {
  public resourceUrl = "api/rounds";

  constructor(protected http: HttpClient) {}

  create(
    casAssessmentRound: CasAssessmentRound
  ): Observable<CustomResponse<CasAssessmentRound>> {
    return this.http.post<CustomResponse<CasAssessmentRound>>(
      this.resourceUrl,
      casAssessmentRound
    );
  }

  update(
    casAssessmentRound: CasAssessmentRound
  ): Observable<CustomResponse<CasAssessmentRound>> {
    return this.http.put<CustomResponse<CasAssessmentRound>>(
      `${this.resourceUrl}/${casAssessmentRound.id}`,
      casAssessmentRound
    );
  }

  find(id: number): Observable<CustomResponse<CasAssessmentRound>> {
    return this.http.get<CustomResponse<CasAssessmentRound>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CasAssessmentRound[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasAssessmentRound[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
