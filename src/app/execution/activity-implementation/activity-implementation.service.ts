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
import { ActivityImplementation } from "./activity-implementation.model";

@Injectable({ providedIn: "root" })
export class ActivityImplementationService {
  public resourceUrl = "api/activity_implementations";

  constructor(protected http: HttpClient) {}

  create(
    activityImplementation: ActivityImplementation
  ): Observable<CustomResponse<ActivityImplementation>> {
    return this.http.post<CustomResponse<ActivityImplementation>>(
      this.resourceUrl,
      activityImplementation
    );
  }

  update(
    activityImplementation: ActivityImplementation
  ): Observable<CustomResponse<ActivityImplementation>> {
    return this.http.put<CustomResponse<ActivityImplementation>>(
      `${this.resourceUrl}/${activityImplementation.id}`,
      activityImplementation
    );
  }

  find(id: number): Observable<CustomResponse<ActivityImplementation>> {
    return this.http.get<CustomResponse<ActivityImplementation>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ActivityImplementation[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ActivityImplementation[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}