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
import { Projection } from "./projection.model";

@Injectable({ providedIn: "root" })
export class ProjectionService {
  public resourceUrl = "api/projections";

  constructor(protected http: HttpClient) {}

  create(projection: Projection): Observable<CustomResponse<Projection>> {
    return this.http.post<CustomResponse<Projection>>(
      this.resourceUrl,
      projection
    );
  }

  update(projection: Projection): Observable<CustomResponse<Projection>> {
    return this.http.put<CustomResponse<Projection>>(
      `${this.resourceUrl}/${projection.id}`,
      projection
    );
  }

  find(id: number): Observable<CustomResponse<Projection>> {
    return this.http.get<CustomResponse<Projection>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<Projection[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Projection[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}