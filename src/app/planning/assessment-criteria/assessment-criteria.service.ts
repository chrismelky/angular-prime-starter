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
import { AssessmentCriteria } from "./assessment-criteria.model";

@Injectable({ providedIn: "root" })
export class AssessmentCriteriaService {
  public resourceUrl = "api/assessment_criteria";
  public baseUrl = "api/assessor_hierarchies";

  constructor(protected http: HttpClient) {}

  create(
    assessmentCriteria: AssessmentCriteria
  ): Observable<CustomResponse<AssessmentCriteria>> {
    return this.http.post<CustomResponse<AssessmentCriteria>>(
      this.resourceUrl,
      assessmentCriteria
    );
  }

  update(
    assessmentCriteria: AssessmentCriteria
  ): Observable<CustomResponse<AssessmentCriteria>> {
    return this.http.put<CustomResponse<AssessmentCriteria>>(
      `${this.resourceUrl}/${assessmentCriteria.id}`,
      assessmentCriteria
    );
  }

  find(id: number): Observable<CustomResponse<AssessmentCriteria[]>> {
    return this.http.get<CustomResponse<AssessmentCriteria[]>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<AssessmentCriteria[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AssessmentCriteria[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  getDataByUser(): Observable<CustomResponse<any>> {
    return this.http.get<CustomResponse<any>>(
      this.baseUrl
    );
  }
}
