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
import { SectorProblem } from "./sector-problem.model";

@Injectable({ providedIn: "root" })
export class SectorProblemService {
  public resourceUrl = "api/sector_problems";

  constructor(protected http: HttpClient) {}

  create(
    sectorProblem: SectorProblem
  ): Observable<CustomResponse<SectorProblem>> {
    return this.http.post<CustomResponse<SectorProblem>>(
      this.resourceUrl,
      sectorProblem
    );
  }

  update(
    sectorProblem: SectorProblem
  ): Observable<CustomResponse<SectorProblem>> {
    return this.http.put<CustomResponse<SectorProblem>>(
      `${this.resourceUrl}/${sectorProblem.id}`,
      sectorProblem
    );
  }

  find(id: number): Observable<CustomResponse<SectorProblem>> {
    return this.http.get<CustomResponse<SectorProblem>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<SectorProblem[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<SectorProblem[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
