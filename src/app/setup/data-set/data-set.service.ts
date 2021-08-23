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
import { DataSet } from "./data-set.model";

@Injectable({ providedIn: "root" })
export class DataSetService {
  public resourceUrl = "api/data_sets";

  constructor(protected http: HttpClient) {}

  create(dataSet: DataSet): Observable<CustomResponse<DataSet>> {
    return this.http.post<CustomResponse<DataSet>>(this.resourceUrl, dataSet);
  }

  update(dataSet: DataSet): Observable<CustomResponse<DataSet>> {
    return this.http.put<CustomResponse<DataSet>>(
      `${this.resourceUrl}/${dataSet.id}`,
      dataSet
    );
  }

  find(id: number): Observable<CustomResponse<DataSet>> {
    return this.http.get<CustomResponse<DataSet>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<DataSet[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<DataSet[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
