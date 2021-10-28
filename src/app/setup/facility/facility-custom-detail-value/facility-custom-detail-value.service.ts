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

import { createRequestOption } from "../../../utils/request-util";
import { CustomResponse } from "../../../utils/custom-response";
import { FacilityCustomDetailValue } from "./facility-custom-detail-value.model";

@Injectable({ providedIn: "root" })
export class FacilityCustomDetailValueService {
  public resourceUrl = "api/facility_custom_detail_values";

  constructor(protected http: HttpClient) {}

  create(facilityCustomDetailValue: FacilityCustomDetailValue): Observable<CustomResponse<FacilityCustomDetailValue>> {
    return this.http.post<CustomResponse<FacilityCustomDetailValue>>(
      this.resourceUrl,
      facilityCustomDetailValue
    );
  }

  update(
    facilityCustomDetailValue: FacilityCustomDetailValue
  ): Observable<CustomResponse<FacilityCustomDetailValue>> {
    return this.http.put<CustomResponse<FacilityCustomDetailValue>>(
      `${this.resourceUrl}/${facilityCustomDetailValue.id}`,
      facilityCustomDetailValue
    );
  }

  find(id: number): Observable<CustomResponse<FacilityCustomDetailValue>> {
    return this.http.get<CustomResponse<FacilityCustomDetailValue>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FacilityCustomDetailValue[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FacilityCustomDetailValue[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
