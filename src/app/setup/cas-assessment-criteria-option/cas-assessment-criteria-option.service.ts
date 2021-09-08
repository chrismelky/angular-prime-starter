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
import { CasAssessmentCriteriaOption } from "./cas-assessment-criteria-option.model";
import {CasAssessmentCriteria} from "../cas-assessment-criteria/cas-assessment-criteria.model";

@Injectable({ providedIn: "root" })
export class CasAssessmentCriteriaOptionService {
  public resourceUrl = "api/cas_criteria_options";
  public baseUrl = "api/get_criteria_by_category";
  public url = "api/get_criteria_by_cas_plan_content";

  constructor(protected http: HttpClient) {}

  create(
    casAssessmentCriteriaOption: CasAssessmentCriteriaOption
  ): Observable<CustomResponse<CasAssessmentCriteriaOption>> {
    return this.http.post<CustomResponse<CasAssessmentCriteriaOption>>(
      this.resourceUrl,
      casAssessmentCriteriaOption
    );
  }

  update(
    casAssessmentCriteriaOption: CasAssessmentCriteriaOption
  ): Observable<CustomResponse<CasAssessmentCriteriaOption>> {
    return this.http.put<CustomResponse<CasAssessmentCriteriaOption>>(
      `${this.resourceUrl}/${casAssessmentCriteriaOption.id}`,
      casAssessmentCriteriaOption
    );
  }

  find(id: number): Observable<CustomResponse<CasAssessmentCriteriaOption>> {
    return this.http.get<CustomResponse<CasAssessmentCriteriaOption>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CasAssessmentCriteriaOption[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasAssessmentCriteriaOption[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }


  findById(id: {}): Observable<CustomResponse<CasAssessmentCriteriaOption[]>> {
    return this.http.post<CustomResponse<CasAssessmentCriteriaOption[]>>(
      `${this.baseUrl}`,id
    );
  }

  findByCasContentId(id: { }): Observable<CustomResponse<CasAssessmentCriteriaOption[]>> {
    return this.http.post<CustomResponse<CasAssessmentCriteriaOption[]>>(
      `${this.url}`,id
    );
  }
}
