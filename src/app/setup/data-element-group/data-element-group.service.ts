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
import { DataElementGroup } from "./data-element-group.model";

@Injectable({ providedIn: "root" })
export class DataElementGroupService {
  public resourceUrl = "api/data_element_groups";

  constructor(protected http: HttpClient) {}

  create(
    dataElementGroup: DataElementGroup
  ): Observable<CustomResponse<DataElementGroup>> {
    return this.http.post<CustomResponse<DataElementGroup>>(
      this.resourceUrl,
      dataElementGroup
    );
  }

  update(
    dataElementGroup: DataElementGroup
  ): Observable<CustomResponse<DataElementGroup>> {
    return this.http.put<CustomResponse<DataElementGroup>>(
      `${this.resourceUrl}/${dataElementGroup.id}`,
      dataElementGroup
    );
  }

  find(id: number): Observable<CustomResponse<DataElementGroup>> {
    return this.http.get<CustomResponse<DataElementGroup>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<DataElementGroup[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<DataElementGroup[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
