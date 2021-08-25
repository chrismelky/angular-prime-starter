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
import { CasAssessmentSubCriteria } from "./cas-assessment-sub-criteria.model";

@Injectable({ providedIn: "root" })
export class CasAssessmentSubCriteriaService {
  public resourceUrl = "api/cas_sub_criterias";

  constructor(protected http: HttpClient) {}

  create(
    casAssessmentSubCriteria: CasAssessmentSubCriteria
  ): Observable<CustomResponse<CasAssessmentSubCriteria>> {
    return this.http.post<CustomResponse<CasAssessmentSubCriteria>>(
      this.resourceUrl,
      casAssessmentSubCriteria
    );
  }

  update(
    casAssessmentSubCriteria: CasAssessmentSubCriteria
  ): Observable<CustomResponse<CasAssessmentSubCriteria>> {
    return this.http.put<CustomResponse<CasAssessmentSubCriteria>>(
      `${this.resourceUrl}/${casAssessmentSubCriteria.id}`,
      casAssessmentSubCriteria
    );
  }

  find(id: number): Observable<CustomResponse<CasAssessmentSubCriteria>> {
    return this.http.get<CustomResponse<CasAssessmentSubCriteria>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CasAssessmentSubCriteria[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasAssessmentSubCriteria[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
