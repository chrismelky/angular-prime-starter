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
import { CasAssessmentCategory } from "./cas-assessment-category.model";

@Injectable({ providedIn: "root" })
export class CasAssessmentCategoryService {
  public resourceUrl = "api/cas_categories";

  constructor(protected http: HttpClient) {}

  create(
    casAssessmentCategory: CasAssessmentCategory
  ): Observable<CustomResponse<CasAssessmentCategory>> {
    return this.http.post<CustomResponse<CasAssessmentCategory>>(
      this.resourceUrl,
      casAssessmentCategory
    );
  }

  update(
    casAssessmentCategory: CasAssessmentCategory
  ): Observable<CustomResponse<CasAssessmentCategory>> {
    return this.http.put<CustomResponse<CasAssessmentCategory>>(
      `${this.resourceUrl}/${casAssessmentCategory.id}`,
      casAssessmentCategory
    );
  }

  find(id: any): Observable<CustomResponse<CasAssessmentCategory>> {
    return this.http.get<CustomResponse<CasAssessmentCategory>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CasAssessmentCategory[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasAssessmentCategory[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
