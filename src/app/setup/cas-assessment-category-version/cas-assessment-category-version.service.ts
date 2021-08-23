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
import { CasAssessmentCategoryVersion } from "./cas-assessment-category-version.model";

@Injectable({ providedIn: "root" })
export class CasAssessmentCategoryVersionService {
  public resourceUrl = "api/category_versions";

  constructor(protected http: HttpClient) {}

  create(
    casAssessmentCategoryVersion: CasAssessmentCategoryVersion
  ): Observable<CustomResponse<CasAssessmentCategoryVersion>> {
    return this.http.post<CustomResponse<CasAssessmentCategoryVersion>>(
      this.resourceUrl,
      casAssessmentCategoryVersion
    );
  }

  update(
    casAssessmentCategoryVersion: CasAssessmentCategoryVersion
  ): Observable<CustomResponse<CasAssessmentCategoryVersion>> {
    return this.http.put<CustomResponse<CasAssessmentCategoryVersion>>(
      `${this.resourceUrl}/${casAssessmentCategoryVersion.id}`,
      casAssessmentCategoryVersion
    );
  }

  find(id: number): Observable<CustomResponse<CasAssessmentCategoryVersion>> {
    return this.http.get<CustomResponse<CasAssessmentCategoryVersion>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CasAssessmentCategoryVersion[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasAssessmentCategoryVersion[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
