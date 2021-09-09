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
import { AssessorAssignment } from "./assessor-assignment.model";

@Injectable({ providedIn: "root" })
export class AssessorAssignmentService {
  public resourceUrl = "api/assessor_assignments";

  constructor(protected http: HttpClient) {}

  create(
    assessorAssignment: AssessorAssignment
  ): Observable<CustomResponse<AssessorAssignment>> {
    return this.http.post<CustomResponse<AssessorAssignment>>(
      this.resourceUrl,
      assessorAssignment
    );
  }

  update(
    assessorAssignment: AssessorAssignment
  ): Observable<CustomResponse<AssessorAssignment>> {
    return this.http.put<CustomResponse<AssessorAssignment>>(
      `${this.resourceUrl}/${assessorAssignment.id}`,
      assessorAssignment
    );
  }

  find(id: number): Observable<CustomResponse<AssessorAssignment>> {
    return this.http.get<CustomResponse<AssessorAssignment>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<AssessorAssignment[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AssessorAssignment[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
