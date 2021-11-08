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
import { ActivityInput, BudgetStatus } from './activity-input.model';

@Injectable({ providedIn: 'root' })
export class ActivityInputService {
  public resourceUrl = 'api/activity_inputs';

  constructor(protected http: HttpClient) {}

  create(
    activityInput: ActivityInput
  ): Observable<CustomResponse<ActivityInput>> {
    return this.http.post<CustomResponse<ActivityInput>>(
      this.resourceUrl,
      activityInput
    );
  }

  update(
    activityInput: ActivityInput
  ): Observable<CustomResponse<ActivityInput>> {
    return this.http.put<CustomResponse<ActivityInput>>(
      `${this.resourceUrl}/${activityInput.id}`,
      activityInput
    );
  }

  find(id: number): Observable<CustomResponse<ActivityInput>> {
    return this.http.get<CustomResponse<ActivityInput>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ActivityInput[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ActivityInput[]>>(this.resourceUrl, {
      params: options,
    });
  }

  getStatus(req?: any): Observable<CustomResponse<BudgetStatus>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<BudgetStatus>>(
      `${this.resourceUrl}/budgeting_status`,
      {
        params: options,
      }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
