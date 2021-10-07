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
import {CreateProjectFundSource, ProjectFundSource} from "./project-fund-source.model";

@Injectable({ providedIn: "root" })
export class ProjectFundSourceService {
  public resourceUrl = "api/project_fund_sources";

  constructor(protected http: HttpClient) {}

  create(
    projectFundSource: ProjectFundSource
  ): Observable<CustomResponse<ProjectFundSource>> {
    return this.http.post<CustomResponse<ProjectFundSource>>(
      this.resourceUrl,
      projectFundSource
    );
  }

  update(
    projectFundSource: ProjectFundSource
  ): Observable<CustomResponse<ProjectFundSource>> {
    return this.http.put<CustomResponse<ProjectFundSource>>(
      `${this.resourceUrl}/${projectFundSource.id}`,
      projectFundSource
    );
  }

  find(id: number): Observable<CustomResponse<ProjectFundSource>> {
    return this.http.get<CustomResponse<ProjectFundSource>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ProjectFundSource[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ProjectFundSource[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  addMultipleFundSources(data: CreateProjectFundSource): Observable<CustomResponse<ProjectFundSource[]>> {
    return this.http.post<CustomResponse<ProjectFundSource[]>>(`${this.resourceUrl}/addMultipleFundSources`, data);
  }
}
