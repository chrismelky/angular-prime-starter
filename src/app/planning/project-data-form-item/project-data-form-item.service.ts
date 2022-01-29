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
import { ProjectDataFormItem } from "./project-data-form-item.model";

@Injectable({ providedIn: "root" })
export class ProjectDataFormItemService {
  public resourceUrl = "api/project_data_form_items";

  constructor(protected http: HttpClient) {}

  create(
    projectDataFormItem: ProjectDataFormItem
  ): Observable<CustomResponse<ProjectDataFormItem>> {
    return this.http.post<CustomResponse<ProjectDataFormItem>>(
      this.resourceUrl,
      projectDataFormItem
    );
  }

  update(
    projectDataFormItem: ProjectDataFormItem
  ): Observable<CustomResponse<ProjectDataFormItem>> {
    return this.http.put<CustomResponse<ProjectDataFormItem>>(
      `${this.resourceUrl}/${projectDataFormItem.id}`,
      projectDataFormItem
    );
  }

  find(id: number): Observable<CustomResponse<ProjectDataFormItem>> {
    return this.http.get<CustomResponse<ProjectDataFormItem>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ProjectDataFormItem[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ProjectDataFormItem[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
