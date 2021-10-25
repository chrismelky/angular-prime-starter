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
  private assessorsUrl = "api/get-assessors";
  private adminUrl = "api/get-regions";

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
  getAssessors(req?: any): Observable<CustomResponse<AssessorAssignment[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AssessorAssignment[]>>(
      this.assessorsUrl,{ params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  getAssignedRegions(round_id: number,fy_id: number,version_id: number,user_id: number,admin_position: any ): Observable<CustomResponse<AssessorAssignment[]>> {
    return this.http.get<CustomResponse<AssessorAssignment[]>>(
      `${this.adminUrl}/${round_id}/${fy_id}/${version_id}/${user_id}/${admin_position}`
    );
  }
}
