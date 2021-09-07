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
import { FacilityCustomDetailMapping } from "./facility-custom-detail-mapping.model";

@Injectable({ providedIn: "root" })
export class FacilityCustomDetailMappingService {
  public resourceUrl = "api/facility_custom_detail_mappings";

  constructor(protected http: HttpClient) {}

  create(
    facilityCustomDetailMapping: FacilityCustomDetailMapping
  ): Observable<CustomResponse<FacilityCustomDetailMapping>> {
    return this.http.post<CustomResponse<FacilityCustomDetailMapping>>(
      this.resourceUrl,
      facilityCustomDetailMapping
    );
  }

  update(
    facilityCustomDetailMapping: FacilityCustomDetailMapping
  ): Observable<CustomResponse<FacilityCustomDetailMapping>> {
    return this.http.put<CustomResponse<FacilityCustomDetailMapping>>(
      `${this.resourceUrl}/${facilityCustomDetailMapping.id}`,
      facilityCustomDetailMapping
    );
  }

  find(id: number): Observable<CustomResponse<FacilityCustomDetailMapping>> {
    return this.http.get<CustomResponse<FacilityCustomDetailMapping>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FacilityCustomDetailMapping[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FacilityCustomDetailMapping[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
