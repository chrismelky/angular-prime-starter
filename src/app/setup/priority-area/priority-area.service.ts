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
import { PriorityArea } from "./priority-area.model";

@Injectable({ providedIn: "root" })
export class PriorityAreaService {
  public resourceUrl = "api/priority_areas";

  constructor(protected http: HttpClient) {}

  create(priorityArea: PriorityArea): Observable<CustomResponse<PriorityArea>> {
    return this.http.post<CustomResponse<PriorityArea>>(
      this.resourceUrl,
      priorityArea
    );
  }

  update(priorityArea: PriorityArea): Observable<CustomResponse<PriorityArea>> {
    return this.http.put<CustomResponse<PriorityArea>>(
      `${this.resourceUrl}/${priorityArea.id}`,
      priorityArea
    );
  }

  find(id: number): Observable<CustomResponse<PriorityArea>> {
    return this.http.get<CustomResponse<PriorityArea>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<PriorityArea[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<PriorityArea[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
