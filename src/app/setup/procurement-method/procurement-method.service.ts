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
import { ProcurementMethod } from "./procurement-method.model";

@Injectable({ providedIn: "root" })
export class ProcurementMethodService {
  public resourceUrl = "api/procurement_methods";

  constructor(protected http: HttpClient) {}

  create(
    procurementMethod: ProcurementMethod
  ): Observable<CustomResponse<ProcurementMethod>> {
    return this.http.post<CustomResponse<ProcurementMethod>>(
      this.resourceUrl,
      procurementMethod
    );
  }

  update(
    procurementMethod: ProcurementMethod
  ): Observable<CustomResponse<ProcurementMethod>> {
    return this.http.put<CustomResponse<ProcurementMethod>>(
      `${this.resourceUrl}/${procurementMethod.id}`,
      procurementMethod
    );
  }

  find(id: number): Observable<CustomResponse<ProcurementMethod>> {
    return this.http.get<CustomResponse<ProcurementMethod>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ProcurementMethod[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ProcurementMethod[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
