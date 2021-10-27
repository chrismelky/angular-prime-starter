/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {createRequestOption} from "../../utils/request-util";
import {CustomResponse} from "../../utils/custom-response";
import {FacilityCustomDetail} from "./facility-custom-detail.model";

@Injectable({providedIn: "root"})
export class FacilityCustomDetailService {
  public resourceUrl = "api/facility_custom_details";

  constructor(protected http: HttpClient) {
  }

  create(
    facilityCustomDetail: FacilityCustomDetail
  ): Observable<CustomResponse<FacilityCustomDetail>> {
    return this.http.post<CustomResponse<FacilityCustomDetail>>(
      this.resourceUrl,
      facilityCustomDetail
    );
  }

  update(
    facilityCustomDetail: FacilityCustomDetail
  ): Observable<CustomResponse<FacilityCustomDetail>> {
    return this.http.put<CustomResponse<FacilityCustomDetail>>(
      `${this.resourceUrl}/${facilityCustomDetail.id}`,
      facilityCustomDetail
    );
  }

  find(id: number): Observable<CustomResponse<FacilityCustomDetail>> {
    return this.http.get<CustomResponse<FacilityCustomDetail>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FacilityCustomDetail[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FacilityCustomDetail[]>>(
      this.resourceUrl,
      {params: options}
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  filterByFacilityType(facilityTypeId: number | undefined): Observable<CustomResponse<FacilityCustomDetail[]>> {
    return this.http.get<CustomResponse<FacilityCustomDetail[]>>(
      `${this.resourceUrl}/filterByFacilityType/${facilityTypeId}`
    );
  }
}
