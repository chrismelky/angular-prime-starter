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
  public url = "api/cas_results";
  public commentUrl = "api/cas_sub_criteria_comments";
  public baseUrl = "api/assessor_hierarchies";
  public reportUrl = "api/assessment_criteria";
  public criteriaScore = "api/assessment_criteria_score";

  constructor(protected http: HttpClient) {}

  create(
    assessmentCriteria: AssessmentCriteria
  ): Observable<CustomResponse<AssessmentCriteria>> {
    return this.http.post<CustomResponse<AssessmentCriteria>>(
      this.url,
      assessmentCriteria
    );
  }

createComment(
    assessmentCriteria: AssessmentCriteria
  ): Observable<CustomResponse<AssessmentCriteria>> {
    return this.http.post<CustomResponse<AssessmentCriteria>>(
      this.commentUrl,
      assessmentCriteria
    );
  }

  updateComment(
    assessmentCriteria: AssessmentCriteria
  ): Observable<CustomResponse<AssessmentCriteria>> {
    return this.http.put<CustomResponse<AssessmentCriteria>>(
      `${this.commentUrl}/${assessmentCriteria.id}`,
      assessmentCriteria
    );
  }

  update(
    assessmentCriteria: AssessmentCriteria
  ): Observable<CustomResponse<AssessmentCriteria>> {
    return this.http.put<CustomResponse<AssessmentCriteria>>(
      `${this.url}/${assessmentCriteria.id}`,
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

  getDataByUser(round_id: number, fy_id: number, version_id: number): Observable<CustomResponse<any>> {
    return this.http.get<CustomResponse<any>>(
      `${this.baseUrl}/${round_id}/${fy_id}/${version_id}`
    );
  }

  getAssessmentReport(admin_hierarchy_id: number, financial_year_id: number,round_id: number, version_id: number){
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    };
    return this.http.get<any>(
      `${this.reportUrl}/${admin_hierarchy_id}/${financial_year_id}/${round_id}/${version_id}`,httpOptions
    );
  }

  getCriteriaScores(admin_id: number,round_id: number,version_id: number) {
    return this.http.get<CustomResponse<AssessmentCriteria[]>>(
      `${this.resourceUrl}/${admin_id}/${round_id}/${version_id}`
    )
  }
}
