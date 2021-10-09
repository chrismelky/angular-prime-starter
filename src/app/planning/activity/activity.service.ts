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
import {
  Activity,
  ActivityFacility,
  ActivityFundSource,
} from './activity.model';
import { NationalReference } from 'src/app/setup/national-reference/national-reference.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  public resourceUrl = 'api/activities';

  constructor(protected http: HttpClient) {}

  create(activity: Activity): Observable<CustomResponse<Activity>> {
    return this.http.post<CustomResponse<Activity>>(this.resourceUrl, activity);
  }

  update(activity: Activity): Observable<CustomResponse<Activity>> {
    return this.http.put<CustomResponse<Activity>>(
      `${this.resourceUrl}/${activity.id}`,
      activity
    );
  }

  find(id: number): Observable<CustomResponse<Activity>> {
    return this.http.get<CustomResponse<Activity>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Activity[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Activity[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  activityFacilities(
    financialYearId: number,
    activityId: number
  ): Observable<CustomResponse<ActivityFacility[]>> {
    return this.http.get<CustomResponse<ActivityFacility[]>>(
      `${this.resourceUrl}/facilities/${financialYearId}/${activityId}`
    );
  }

  deleteActivityFacility(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(
      `${this.resourceUrl}/facilities/${id}`
    );
  }

  deleteActivityFundSource(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(
      `${this.resourceUrl}/fund_sources/${id}`
    );
  }

  activityFundSources(
    financialYearId: number,
    activityId: number
  ): Observable<CustomResponse<ActivityFundSource[]>> {
    return this.http.get<CustomResponse<ActivityFundSource[]>>(
      `${this.resourceUrl}/fund_sources/${financialYearId}/${activityId}`
    );
  }

  activityReferences(
    financialYearId: number,
    activityId: number
  ): Observable<CustomResponse<NationalReference[]>> {
    return this.http.get<CustomResponse<NationalReference[]>>(
      `${this.resourceUrl}/references/${financialYearId}/${activityId}`
    );
  }
}
