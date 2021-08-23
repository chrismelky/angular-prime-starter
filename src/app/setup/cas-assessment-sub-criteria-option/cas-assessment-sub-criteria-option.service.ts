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
import { CasAssessmentSubCriteriaOption } from "./cas-assessment-sub-criteria-option.model";

@Injectable({ providedIn: "root" })
export class CasAssessmentSubCriteriaOptionService {
  public resourceUrl = "api/sub_criteria_options";

  constructor(protected http: HttpClient) {}

  create(
    casAssessmentSubCriteriaOption: CasAssessmentSubCriteriaOption
  ): Observable<CustomResponse<CasAssessmentSubCriteriaOption>> {
    return this.http.post<CustomResponse<CasAssessmentSubCriteriaOption>>(
      this.resourceUrl,
      casAssessmentSubCriteriaOption
    );
  }

  update(
    casAssessmentSubCriteriaOption: CasAssessmentSubCriteriaOption
  ): Observable<CustomResponse<CasAssessmentSubCriteriaOption>> {
    return this.http.put<CustomResponse<CasAssessmentSubCriteriaOption>>(
      `${this.resourceUrl}/${casAssessmentSubCriteriaOption.id}`,
      casAssessmentSubCriteriaOption
    );
  }

  find(id: number): Observable<CustomResponse<CasAssessmentSubCriteriaOption>> {
    return this.http.get<CustomResponse<CasAssessmentSubCriteriaOption>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(
    req?: any
  ): Observable<CustomResponse<CasAssessmentSubCriteriaOption[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasAssessmentSubCriteriaOption[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}