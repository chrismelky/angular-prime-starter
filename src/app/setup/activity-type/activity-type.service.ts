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
import { ActivityType } from "./activity-type.model";

@Injectable({ providedIn: "root" })
export class ActivityTypeService {
  public resourceUrl = "api/activity_types";

  constructor(protected http: HttpClient) {}

  create(activityType: ActivityType): Observable<CustomResponse<ActivityType>> {
    return this.http.post<CustomResponse<ActivityType>>(
      this.resourceUrl,
      activityType
    );
  }

  update(activityType: ActivityType): Observable<CustomResponse<ActivityType>> {
    return this.http.put<CustomResponse<ActivityType>>(
      `${this.resourceUrl}/${activityType.id}`,
      activityType
    );
  }

  find(id: number): Observable<CustomResponse<ActivityType>> {
    return this.http.get<CustomResponse<ActivityType>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ActivityType[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ActivityType[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
