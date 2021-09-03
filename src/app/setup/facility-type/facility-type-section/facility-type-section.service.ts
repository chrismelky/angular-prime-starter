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

import {createRequestOption} from "../../../utils/request-util";
import {CustomResponse} from "../../../utils/custom-response";
import {CreateFacilityTypeSection, FacilityTypeSection} from "./facility-type-section.model";

@Injectable({providedIn: "root"})
export class FacilityTypeSectionService {
  public resourceUrl = "api/facility_type_sections";

  constructor(protected http: HttpClient) {
  }

  create(
    facilityTypeSection: FacilityTypeSection
  ): Observable<CustomResponse<FacilityTypeSection>> {
    return this.http.post<CustomResponse<FacilityTypeSection>>(
      this.resourceUrl,
      facilityTypeSection
    );
  }

  addMultipleSections(data: CreateFacilityTypeSection): Observable<CustomResponse<null>> {
    return this.http.post<CustomResponse<null>>(`${this.resourceUrl}/addMultipleSections`, data);
  }

  update(
    facilityTypeSection: FacilityTypeSection
  ): Observable<CustomResponse<FacilityTypeSection>> {
    return this.http.put<CustomResponse<FacilityTypeSection>>(
      `${this.resourceUrl}/${facilityTypeSection.id}`,
      facilityTypeSection
    );
  }

  find(id: number): Observable<CustomResponse<FacilityTypeSection>> {
    return this.http.get<CustomResponse<FacilityTypeSection>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FacilityTypeSection[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FacilityTypeSection[]>>(
      this.resourceUrl,
      {params: options}
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
