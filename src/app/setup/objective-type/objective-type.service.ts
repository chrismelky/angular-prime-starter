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
import { ObjectiveType } from "./objective-type.model";

@Injectable({ providedIn: "root" })
export class ObjectiveTypeService {
  public resourceUrl = "api/objective_types";

  constructor(protected http: HttpClient) {}

  create(
    objectiveType: ObjectiveType
  ): Observable<CustomResponse<ObjectiveType>> {
    return this.http.post<CustomResponse<ObjectiveType>>(
      this.resourceUrl,
      objectiveType
    );
  }

  update(
    objectiveType: ObjectiveType
  ): Observable<CustomResponse<ObjectiveType>> {
    return this.http.put<CustomResponse<ObjectiveType>>(
      `${this.resourceUrl}/${objectiveType.id}`,
      objectiveType
    );
  }

  find(id: number): Observable<CustomResponse<ObjectiveType>> {
    return this.http.get<CustomResponse<ObjectiveType>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ObjectiveType[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ObjectiveType[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
