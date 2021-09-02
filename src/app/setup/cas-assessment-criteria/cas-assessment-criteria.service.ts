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
import { CasAssessmentCriteria } from "./cas-assessment-criteria.model";

@Injectable({ providedIn: "root" })
export class CasAssessmentCriteriaService {
  public resourceUrl = "api/cas_criterias";
  public baseUrl = "api/get_criteria_by_category";

  constructor(protected http: HttpClient) {}

  create(
    casAssessmentCriteria: CasAssessmentCriteria
  ): Observable<CustomResponse<CasAssessmentCriteria>> {
    return this.http.post<CustomResponse<CasAssessmentCriteria>>(
      this.resourceUrl,
      casAssessmentCriteria
    );
  }

  update(
    casAssessmentCriteria: CasAssessmentCriteria
  ): Observable<CustomResponse<CasAssessmentCriteria>> {
    return this.http.put<CustomResponse<CasAssessmentCriteria>>(
      `${this.resourceUrl}/${casAssessmentCriteria.id}`,
      casAssessmentCriteria
    );
  }

  find(id: number): Observable<CustomResponse<CasAssessmentCriteria>> {
    return this.http.get<CustomResponse<CasAssessmentCriteria>>(
      `${this.resourceUrl}/${id}`
    );
  }

  findById(id: {}): Observable<CustomResponse<CasAssessmentCriteria[]>> {
    return this.http.post<CustomResponse<CasAssessmentCriteria[]>>(
      `${this.baseUrl}`,id
    );
  }
  query(req?: any): Observable<CustomResponse<CasAssessmentCriteria[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasAssessmentCriteria[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
