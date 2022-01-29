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
import { ProjectDataForm } from "./project-data-form.model";

@Injectable({ providedIn: "root" })
export class ProjectDataFormService {
  public resourceUrl = "api/project_data_forms";

  constructor(protected http: HttpClient) {}

  create(
    projectDataForm: ProjectDataForm
  ): Observable<CustomResponse<ProjectDataForm>> {
    return this.http.post<CustomResponse<ProjectDataForm>>(
      this.resourceUrl,
      projectDataForm
    );
  }

  update(
    projectDataForm: ProjectDataForm
  ): Observable<CustomResponse<ProjectDataForm>> {
    return this.http.put<CustomResponse<ProjectDataForm>>(
      `${this.resourceUrl}/${projectDataForm.id}`,
      projectDataForm
    );
  }

  find(id: number): Observable<CustomResponse<ProjectDataForm>> {
    return this.http.get<CustomResponse<ProjectDataForm>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ProjectDataForm[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ProjectDataForm[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
