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
import { ProcurementType } from "./procurement-type.model";

@Injectable({ providedIn: "root" })
export class ProcurementTypeService {
  public resourceUrl = "api/procurement_types";

  constructor(protected http: HttpClient) {}

  create(
    procurementType: ProcurementType
  ): Observable<CustomResponse<ProcurementType>> {
    return this.http.post<CustomResponse<ProcurementType>>(
      this.resourceUrl,
      procurementType
    );
  }

  update(
    procurementType: ProcurementType
  ): Observable<CustomResponse<ProcurementType>> {
    return this.http.put<CustomResponse<ProcurementType>>(
      `${this.resourceUrl}/${procurementType.id}`,
      procurementType
    );
  }

  find(id: number): Observable<CustomResponse<ProcurementType>> {
    return this.http.get<CustomResponse<ProcurementType>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ProcurementType[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ProcurementType[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
