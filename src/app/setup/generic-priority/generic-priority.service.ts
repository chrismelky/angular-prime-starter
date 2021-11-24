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
import { GenericPriority } from './generic-priority.model';

@Injectable({ providedIn: 'root' })
export class GenericPriorityService {
  public resourceUrl = 'api/generic_priorities';

  constructor(protected http: HttpClient) {}

  create(
    genericPriority: GenericPriority
  ): Observable<CustomResponse<GenericPriority>> {
    return this.http.post<CustomResponse<GenericPriority>>(
      this.resourceUrl,
      genericPriority
    );
  }

  update(
    genericPriority: GenericPriority
  ): Observable<CustomResponse<GenericPriority>> {
    return this.http.put<CustomResponse<GenericPriority>>(
      `${this.resourceUrl}/${genericPriority.id}`,
      genericPriority
    );
  }

  find(id: number): Observable<CustomResponse<GenericPriority>> {
    return this.http.get<CustomResponse<GenericPriority>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<GenericPriority[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<GenericPriority[]>>(this.resourceUrl, {
      params: options,
    });
  }

  bySector(sectorId: number): Observable<CustomResponse<GenericPriority[]>> {
    return this.http.get<CustomResponse<GenericPriority[]>>(
      `${this.resourceUrl}/by-sector/${sectorId}`
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
