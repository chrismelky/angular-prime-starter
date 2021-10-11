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
import { PlanningMatrix } from "./planning-matrix.model";

@Injectable({ providedIn: "root" })
export class PlanningMatrixService {
  public resourceUrl = "api/planning_matrices";

  constructor(protected http: HttpClient) {}

  create(
    planningMatrix: PlanningMatrix
  ): Observable<CustomResponse<PlanningMatrix>> {
    return this.http.post<CustomResponse<PlanningMatrix>>(
      this.resourceUrl,
      planningMatrix
    );
  }

  update(
    planningMatrix: PlanningMatrix
  ): Observable<CustomResponse<PlanningMatrix>> {
    return this.http.put<CustomResponse<PlanningMatrix>>(
      `${this.resourceUrl}/${planningMatrix.id}`,
      planningMatrix
    );
  }

  find(id: number): Observable<CustomResponse<PlanningMatrix>> {
    return this.http.get<CustomResponse<PlanningMatrix>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<PlanningMatrix[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<PlanningMatrix[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
