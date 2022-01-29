/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { createRequestOption } from '../../utils/request-util';
import { CustomResponse } from '../../utils/custom-response';
import { Project } from './project.model';
import { GfsCode } from '../gfs-code/gfs-code.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  public resourceUrl = 'api/projects';

  constructor(protected http: HttpClient) {}

  create(project: Project): Observable<CustomResponse<Project>> {
    return this.http.post<CustomResponse<Project>>(this.resourceUrl, project);
  }

  update(project: Project): Observable<CustomResponse<Project>> {
    return this.http.put<CustomResponse<Project>>(
      `${this.resourceUrl}/${project.id}`,
      project
    );
  }

  find(id: number): Observable<CustomResponse<Project>> {
    return this.http.get<CustomResponse<Project>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Project[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Project[]>>(this.resourceUrl, {
      params: options,
    });
  }

  byBudgetClassAndSection(
    budgetClassId: number,
    sectionIds: any
  ): Observable<CustomResponse<Project[]>> {
    console.log(sectionIds);
    const options = createRequestOption(sectionIds);
    console.log(options);

    return this.http.get<CustomResponse<Project[]>>(
      `${this.resourceUrl}/by_budget_class_and_section_ids/${budgetClassId}`,
      {
        params: options,
      }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  upload(data: any): Observable<CustomResponse<Project[]>> {
    return this.http.post<CustomResponse<Project[]>>(
      this.resourceUrl + '/upload',
      data
    );
  }

  downloadTemplate(): any {
    return this.http.get(this.resourceUrl + '/downloadUploadTemplate', {
      responseType: 'arraybuffer',
    });
  }


  queryProjectByDepartment(req?: any): Observable<CustomResponse<Project[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Project[]>>(this.resourceUrl +'/project-by-department', {
      params: options,
    });
  }
}
