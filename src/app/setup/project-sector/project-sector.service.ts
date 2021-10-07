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
import {CreateProjectSector, ProjectSector} from "./project-sector.model";

@Injectable({ providedIn: "root" })
export class ProjectSectorService {
  public resourceUrl = "api/project_sectors";

  constructor(protected http: HttpClient) {}

  create(
    projectSector: ProjectSector
  ): Observable<CustomResponse<ProjectSector>> {
    return this.http.post<CustomResponse<ProjectSector>>(
      this.resourceUrl,
      projectSector
    );
  }

  update(
    projectSector: ProjectSector
  ): Observable<CustomResponse<ProjectSector>> {
    return this.http.put<CustomResponse<ProjectSector>>(
      `${this.resourceUrl}/${projectSector.id}`,
      projectSector
    );
  }

  find(id: number): Observable<CustomResponse<ProjectSector>> {
    return this.http.get<CustomResponse<ProjectSector>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ProjectSector[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ProjectSector[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  addMultipleSectors(data: CreateProjectSector): Observable<CustomResponse<ProjectSector[]>> {
    return this.http.post<CustomResponse<ProjectSector[]>>(`${this.resourceUrl}/addMultipleSectors`, data);
  }
}
