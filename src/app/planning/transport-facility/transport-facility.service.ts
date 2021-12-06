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
import { TransportFacility } from "./transport-facility.model";

@Injectable({ providedIn: "root" })
export class TransportFacilityService {
  public resourceUrl = "api/transport_facilities";

  constructor(protected http: HttpClient) {}

  create(
    transportFacility: TransportFacility
  ): Observable<CustomResponse<TransportFacility>> {
    return this.http.post<CustomResponse<TransportFacility>>(
      this.resourceUrl,
      transportFacility
    );
  }

  update(
    transportFacility: TransportFacility
  ): Observable<CustomResponse<TransportFacility>> {
    return this.http.put<CustomResponse<TransportFacility>>(
      `${this.resourceUrl}/${transportFacility.id}`,
      transportFacility
    );
  }

  find(id: number): Observable<CustomResponse<TransportFacility>> {
    return this.http.get<CustomResponse<TransportFacility>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<TransportFacility[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<TransportFacility[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
