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
import { CasAssessmentCategoryVersionState } from "./cas-assessment-category-version-state.model";

@Injectable({ providedIn: "root" })
export class CasAssessmentCategoryVersionStateService {
  public resourceUrl = "api/category_version_states";

  constructor(protected http: HttpClient) {}

  create(
    casAssessmentCategoryVersionState: CasAssessmentCategoryVersionState
  ): Observable<CustomResponse<CasAssessmentCategoryVersionState>> {
    return this.http.post<CustomResponse<CasAssessmentCategoryVersionState>>(
      this.resourceUrl,
      casAssessmentCategoryVersionState
    );
  }

  update(
    casAssessmentCategoryVersionState: CasAssessmentCategoryVersionState
  ): Observable<CustomResponse<CasAssessmentCategoryVersionState>> {
    return this.http.put<CustomResponse<CasAssessmentCategoryVersionState>>(
      `${this.resourceUrl}/${casAssessmentCategoryVersionState.id}`,
      casAssessmentCategoryVersionState
    );
  }

  find(
    id: number
  ): Observable<CustomResponse<CasAssessmentCategoryVersionState>> {
    return this.http.get<CustomResponse<CasAssessmentCategoryVersionState>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(
    req?: any
  ): Observable<CustomResponse<CasAssessmentCategoryVersionState[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasAssessmentCategoryVersionState[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
