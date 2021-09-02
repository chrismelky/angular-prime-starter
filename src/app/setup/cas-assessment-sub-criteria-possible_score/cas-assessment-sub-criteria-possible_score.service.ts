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
import { CasAssessmentSubCriteriaPossibleScore } from "./cas-assessment-sub-criteria-possible_score.model";

@Injectable({ providedIn: "root" })
export class CasAssessmentSubCriteriaPossibleScoreService {
  public resourceUrl = "api/sub_criteria_possible_scores";

  constructor(protected http: HttpClient) {}

  create(
    casAssessmentSubCriteriaPossibleScore: CasAssessmentSubCriteriaPossibleScore
  ): Observable<CustomResponse<CasAssessmentSubCriteriaPossibleScore>> {
    return this.http.post<
      CustomResponse<CasAssessmentSubCriteriaPossibleScore>
    >(this.resourceUrl, casAssessmentSubCriteriaPossibleScore);
  }

  update(
    casAssessmentSubCriteriaPossibleScore: CasAssessmentSubCriteriaPossibleScore
  ): Observable<CustomResponse<CasAssessmentSubCriteriaPossibleScore>> {
    return this.http.put<CustomResponse<CasAssessmentSubCriteriaPossibleScore>>(
      `${this.resourceUrl}/${casAssessmentSubCriteriaPossibleScore.id}`,
      casAssessmentSubCriteriaPossibleScore
    );
  }

  find(
    id: number
  ): Observable<CustomResponse<CasAssessmentSubCriteriaPossibleScore>> {
    return this.http.get<CustomResponse<CasAssessmentSubCriteriaPossibleScore>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(
    req?: any
  ): Observable<CustomResponse<CasAssessmentSubCriteriaPossibleScore[]>> {
    console.log(req);
    const options = createRequestOption(req);
    return this.http.get<
      CustomResponse<CasAssessmentSubCriteriaPossibleScore[]>
    >(this.resourceUrl, { params: options });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
