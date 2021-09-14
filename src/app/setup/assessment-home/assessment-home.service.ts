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
import { AssessmentHome } from "./assessment-home.model";

@Injectable({ providedIn: "root" })
export class AssessmentHomeService {
  public resourceUrl = "api/assessment_homes";

  constructor(protected http: HttpClient) {}

  create(
    assessmentHome: AssessmentHome
  ): Observable<CustomResponse<AssessmentHome>> {
    return this.http.post<CustomResponse<AssessmentHome>>(
      this.resourceUrl,
      assessmentHome
    );
  }

  update(
    assessmentHome: AssessmentHome
  ): Observable<CustomResponse<AssessmentHome>> {
    return this.http.put<CustomResponse<AssessmentHome>>(
      `${this.resourceUrl}/${assessmentHome.id}`,
      assessmentHome
    );
  }

  find(id: number): Observable<CustomResponse<AssessmentHome>> {
    return this.http.get<CustomResponse<AssessmentHome>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<AssessmentHome[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AssessmentHome[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
