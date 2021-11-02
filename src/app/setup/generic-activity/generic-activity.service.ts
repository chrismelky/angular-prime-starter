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
import { GenericActivity } from './generic-activity.model';

@Injectable({ providedIn: 'root' })
export class GenericActivityService {
  public resourceUrl = 'api/generic_activities';

  constructor(protected http: HttpClient) {}

  create(
    genericActivity: GenericActivity
  ): Observable<CustomResponse<GenericActivity>> {
    return this.http.post<CustomResponse<GenericActivity>>(
      this.resourceUrl,
      genericActivity
    );
  }

  update(
    genericActivity: GenericActivity
  ): Observable<CustomResponse<GenericActivity>> {
    return this.http.put<CustomResponse<GenericActivity>>(
      `${this.resourceUrl}/${genericActivity.id}`,
      genericActivity
    );
  }

  find(id: number): Observable<CustomResponse<GenericActivity>> {
    return this.http.get<CustomResponse<GenericActivity>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<GenericActivity[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<GenericActivity[]>>(this.resourceUrl, {
      params: options,
    });
  }

  byTargetAndAdminLevelAndCostCentre(
    genericTargetId: number,
    position: number,
    costCentreId: number
  ): Observable<CustomResponse<GenericActivity[]>> {
    return this.http.get<CustomResponse<GenericActivity[]>>(
      `${this.resourceUrl}/by_target_and_admin_level_and_cost_centre/${genericTargetId}/${position}/${costCentreId}`,
      {}
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
