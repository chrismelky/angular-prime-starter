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
import { ProjectOutput } from "./project-output.model";

@Injectable({ providedIn: "root" })
export class ProjectOutputService {
  public resourceUrl = "api/project_outputs";

  constructor(protected http: HttpClient) {}

  create(
    projectOutput: ProjectOutput
  ): Observable<CustomResponse<ProjectOutput>> {
    return this.http.post<CustomResponse<ProjectOutput>>(
      this.resourceUrl,
      projectOutput
    );
  }

  update(
    projectOutput: ProjectOutput
  ): Observable<CustomResponse<ProjectOutput>> {
    return this.http.put<CustomResponse<ProjectOutput>>(
      `${this.resourceUrl}/${projectOutput.id}`,
      projectOutput
    );
  }

  find(id: number): Observable<CustomResponse<ProjectOutput>> {
    return this.http.get<CustomResponse<ProjectOutput>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ProjectOutput[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ProjectOutput[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }


  upload(data: any): Observable<CustomResponse<ProjectOutput[]>> {
    return this.http.post<CustomResponse<ProjectOutput[]>>(
      this.resourceUrl + '/upload',
      data
    );
  }

  downloadTemplate(): any {
    return this.http.get(this.resourceUrl + '/downloadUploadTemplate', {
      responseType: 'arraybuffer',
    });
  }
}
