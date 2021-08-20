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
import { ActivityTaskNature } from "./activity-task-nature.model";

@Injectable({ providedIn: "root" })
export class ActivityTaskNatureService {
  public resourceUrl = "api/activity_task_natures";

  constructor(protected http: HttpClient) {}

  create(
    activityTaskNature: ActivityTaskNature
  ): Observable<CustomResponse<ActivityTaskNature>> {
    return this.http.post<CustomResponse<ActivityTaskNature>>(
      this.resourceUrl,
      activityTaskNature
    );
  }

  update(
    activityTaskNature: ActivityTaskNature
  ): Observable<CustomResponse<ActivityTaskNature>> {
    return this.http.put<CustomResponse<ActivityTaskNature>>(
      `${this.resourceUrl}/${activityTaskNature.id}`,
      activityTaskNature
    );
  }

  find(id: number): Observable<CustomResponse<ActivityTaskNature>> {
    return this.http.get<CustomResponse<ActivityTaskNature>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ActivityTaskNature[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ActivityTaskNature[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
