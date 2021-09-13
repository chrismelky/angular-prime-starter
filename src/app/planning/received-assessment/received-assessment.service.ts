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
import { ReceivedAssessment } from "./received-assessment.model";

@Injectable({ providedIn: "root" })
export class ReceivedAssessmentService {
  public resourceUrl = "api/received_assessments";

  constructor(protected http: HttpClient) {}

  create(
    receivedAssessment: ReceivedAssessment
  ): Observable<CustomResponse<ReceivedAssessment>> {
    return this.http.post<CustomResponse<ReceivedAssessment>>(
      this.resourceUrl,
      receivedAssessment
    );
  }

  update(
    receivedAssessment: ReceivedAssessment
  ): Observable<CustomResponse<ReceivedAssessment>> {
    return this.http.put<CustomResponse<ReceivedAssessment>>(
      `${this.resourceUrl}/${receivedAssessment.id}`,
      receivedAssessment
    );
  }

  find(id: number): Observable<CustomResponse<ReceivedAssessment>> {
    return this.http.get<CustomResponse<ReceivedAssessment>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ReceivedAssessment[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ReceivedAssessment[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
