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
import { GenericTarget } from './generic-target.model';

@Injectable({ providedIn: 'root' })
export class GenericTargetService {
  public resourceUrl = 'api/generic_targets';

  constructor(protected http: HttpClient) {}

  create(
    genericTarget: GenericTarget
  ): Observable<CustomResponse<GenericTarget>> {
    return this.http.post<CustomResponse<GenericTarget>>(
      this.resourceUrl,
      genericTarget
    );
  }

  update(
    genericTarget: GenericTarget
  ): Observable<CustomResponse<GenericTarget>> {
    return this.http.put<CustomResponse<GenericTarget>>(
      `${this.resourceUrl}/${genericTarget.id}`,
      genericTarget
    );
  }

  find(id: number): Observable<CustomResponse<GenericTarget>> {
    return this.http.get<CustomResponse<GenericTarget>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<GenericTarget[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<GenericTarget[]>>(this.resourceUrl, {
      params: options,
    });
  }

  byObjectioveAndSection(
    objectiveId: number,
    sectionId: number
  ): Observable<CustomResponse<GenericTarget[]>> {
    return this.http.get<CustomResponse<GenericTarget[]>>(
      `${this.resourceUrl}/by_objective_and_section/${objectiveId}/${sectionId}`
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
