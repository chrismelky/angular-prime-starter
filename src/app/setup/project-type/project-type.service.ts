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
import { ProjectType } from "./project-type.model";

@Injectable({ providedIn: "root" })
export class ProjectTypeService {
  public resourceUrl = "api/project_types";

  constructor(protected http: HttpClient) {}

  create(projectType: ProjectType): Observable<CustomResponse<ProjectType>> {
    return this.http.post<CustomResponse<ProjectType>>(
      this.resourceUrl,
      projectType
    );
  }

  update(projectType: ProjectType): Observable<CustomResponse<ProjectType>> {
    return this.http.put<CustomResponse<ProjectType>>(
      `${this.resourceUrl}/${projectType.id}`,
      projectType
    );
  }

  find(id: number): Observable<CustomResponse<ProjectType>> {
    return this.http.get<CustomResponse<ProjectType>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ProjectType[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ProjectType[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
