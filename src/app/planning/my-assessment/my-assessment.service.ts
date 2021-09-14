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
import { MyAssessment } from "./my-assessment.model";

@Injectable({ providedIn: "root" })
export class MyAssessmentService {
  public resourceUrl = "api/my_assessments";

  constructor(protected http: HttpClient) {}

  create(myAssessment: MyAssessment): Observable<CustomResponse<MyAssessment>> {
    return this.http.post<CustomResponse<MyAssessment>>(
      this.resourceUrl,
      myAssessment
    );
  }

  update(myAssessment: MyAssessment): Observable<CustomResponse<MyAssessment>> {
    return this.http.put<CustomResponse<MyAssessment>>(
      `${this.resourceUrl}/${myAssessment.id}`,
      myAssessment
    );
  }

  find(id: number): Observable<CustomResponse<MyAssessment>> {
    return this.http.get<CustomResponse<MyAssessment>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<MyAssessment[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<MyAssessment[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
