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
import { Scrutinization } from './scrutinization.model';
import { Activity } from '../activity/activity.model';
import { ActivityInput } from '../../budgeting/activity-input/activity-input.model';

@Injectable({ providedIn: 'root' })
export class ScrutinizationService {
  public activityCommentsUrl = 'api/activity_scrutinization_comments';
  public inputCommentsUrl = 'api/input_scrutinization_comments';
  private activitiesUrl = 'api/scrutinization_activities';
  private activityInputUrl = 'api/scrutinization_inputs';

  constructor(protected http: HttpClient) {}

  create(
    scrutinization: Scrutinization
  ): Observable<CustomResponse<Scrutinization>> {
    return this.http.post<CustomResponse<Scrutinization>>(
      this.activityCommentsUrl,
      scrutinization
    );
  }
  createInputComment(
    scrutinization: Scrutinization
  ): Observable<CustomResponse<Scrutinization>> {
    return this.http.post<CustomResponse<Scrutinization>>(
      this.inputCommentsUrl,
      scrutinization
    );
  }

  update(
    scrutinization: Scrutinization
  ): Observable<CustomResponse<Scrutinization>> {
    return this.http.put<CustomResponse<Scrutinization>>(
      `${this.activityCommentsUrl}/${scrutinization.id}`,
      scrutinization
    );
  }
  updateInputComment(
    scrutinization: Scrutinization
  ): Observable<CustomResponse<Scrutinization>> {
    return this.http.put<CustomResponse<Scrutinization>>(
      `${this.inputCommentsUrl}/${scrutinization.id}`,
      scrutinization
    );
  }

  find(id: number): Observable<CustomResponse<Scrutinization>> {
    return this.http.get<CustomResponse<Scrutinization>>(
      `${this.activityCommentsUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<Scrutinization[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Scrutinization[]>>(
      this.activityCommentsUrl,
      {
        params: options,
      }
    );
  }
  queryActivities(req?: any): Observable<CustomResponse<Activity[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Activity[]>>(this.activitiesUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(
      `${this.activityCommentsUrl}/${id}`
    );
  }

  queryInput(req?: any): Observable<CustomResponse<ActivityInput[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ActivityInput[]>>(
      this.activityInputUrl,
      {
        params: options,
      }
    );
  }

  getUserSubmittedAdminHierarhies(): void {}
}
