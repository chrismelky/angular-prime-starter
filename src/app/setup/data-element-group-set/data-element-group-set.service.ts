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
import { DataElementGroupSet } from "./data-element-group-set.model";

@Injectable({ providedIn: "root" })
export class DataElementGroupSetService {
  public resourceUrl = "api/data_element_group_sets";

  constructor(protected http: HttpClient) {}

  create(
    dataElementGroupSet: DataElementGroupSet
  ): Observable<CustomResponse<DataElementGroupSet>> {
    return this.http.post<CustomResponse<DataElementGroupSet>>(
      this.resourceUrl,
      dataElementGroupSet
    );
  }

  update(
    dataElementGroupSet: DataElementGroupSet
  ): Observable<CustomResponse<DataElementGroupSet>> {
    return this.http.put<CustomResponse<DataElementGroupSet>>(
      `${this.resourceUrl}/${dataElementGroupSet.id}`,
      dataElementGroupSet
    );
  }

  find(id: number): Observable<CustomResponse<DataElementGroupSet>> {
    return this.http.get<CustomResponse<DataElementGroupSet>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<DataElementGroupSet[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<DataElementGroupSet[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
