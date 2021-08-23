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
import { DataElement } from "./data-element.model";

@Injectable({ providedIn: "root" })
export class DataElementService {
  public resourceUrl = "api/data_elements";

  constructor(protected http: HttpClient) {}

  create(dataElement: DataElement): Observable<CustomResponse<DataElement>> {
    return this.http.post<CustomResponse<DataElement>>(
      this.resourceUrl,
      dataElement
    );
  }

  update(dataElement: DataElement): Observable<CustomResponse<DataElement>> {
    return this.http.put<CustomResponse<DataElement>>(
      `${this.resourceUrl}/${dataElement.id}`,
      dataElement
    );
  }

  find(id: number): Observable<CustomResponse<DataElement>> {
    return this.http.get<CustomResponse<DataElement>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<DataElement[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<DataElement[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
