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
import { CasAssessmentSubCriteriaReportSet } from "./cas-assessment-sub-criteria-report_set.model";

@Injectable({ providedIn: "root" })
export class CasAssessmentSubCriteriaReportSetService {
  public resourceUrl = "api/cas_sub_criteria_report_sets";

  constructor(protected http: HttpClient) {}

  create(
    casAssessmentSubCriteriaReportSet: CasAssessmentSubCriteriaReportSet
  ): Observable<CustomResponse<CasAssessmentSubCriteriaReportSet>> {
    return this.http.post<CustomResponse<CasAssessmentSubCriteriaReportSet>>(
      this.resourceUrl,
      casAssessmentSubCriteriaReportSet
    );
  }

  update(
    casAssessmentSubCriteriaReportSet: CasAssessmentSubCriteriaReportSet
  ): Observable<CustomResponse<CasAssessmentSubCriteriaReportSet>> {
    return this.http.put<CustomResponse<CasAssessmentSubCriteriaReportSet>>(
      `${this.resourceUrl}/${casAssessmentSubCriteriaReportSet.id}`,
      casAssessmentSubCriteriaReportSet
    );
  }

  find(
    id: number
  ): Observable<CustomResponse<CasAssessmentSubCriteriaReportSet>> {
    return this.http.get<CustomResponse<CasAssessmentSubCriteriaReportSet>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(
    req?: any
  ): Observable<CustomResponse<CasAssessmentSubCriteriaReportSet[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasAssessmentSubCriteriaReportSet[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}