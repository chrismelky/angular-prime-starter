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
import { FacilityCustomDetailOption } from "./facility-custom-detail-option.model";

@Injectable({ providedIn: "root" })
export class FacilityCustomDetailOptionService {
  public resourceUrl = "api/facility_custom_detail_options";

  constructor(protected http: HttpClient) {}

  create(
    facilityCustomDetailOption: FacilityCustomDetailOption
  ): Observable<CustomResponse<FacilityCustomDetailOption>> {
    return this.http.post<CustomResponse<FacilityCustomDetailOption>>(
      this.resourceUrl,
      facilityCustomDetailOption
    );
  }

  update(
    facilityCustomDetailOption: FacilityCustomDetailOption
  ): Observable<CustomResponse<FacilityCustomDetailOption>> {
    return this.http.put<CustomResponse<FacilityCustomDetailOption>>(
      `${this.resourceUrl}/${facilityCustomDetailOption.id}`,
      facilityCustomDetailOption
    );
  }

  find(id: number): Observable<CustomResponse<FacilityCustomDetailOption>> {
    return this.http.get<CustomResponse<FacilityCustomDetailOption>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FacilityCustomDetailOption[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FacilityCustomDetailOption[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
