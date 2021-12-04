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
import {CreateGfsCodeSection, GfsCodeSection} from "./gfs-code-section.model";

@Injectable({ providedIn: "root" })
export class GfsCodeSectionService {
  public resourceUrl = "api/gfs_code_sections";

  constructor(protected http: HttpClient) {}

  create(
    gfsCodeSection: GfsCodeSection
  ): Observable<CustomResponse<GfsCodeSection>> {
    return this.http.post<CustomResponse<GfsCodeSection>>(
      this.resourceUrl,
      gfsCodeSection
    );
  }

  update(
    gfsCodeSection: GfsCodeSection
  ): Observable<CustomResponse<GfsCodeSection>> {
    return this.http.put<CustomResponse<GfsCodeSection>>(
      `${this.resourceUrl}/${gfsCodeSection.id}`,
      gfsCodeSection
    );
  }

  find(id: number): Observable<CustomResponse<GfsCodeSection>> {
    return this.http.get<CustomResponse<GfsCodeSection>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<GfsCodeSection[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<GfsCodeSection[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  addMultipleSections(data: CreateGfsCodeSection): Observable<CustomResponse<null>> {
    return this.http.post<CustomResponse<null>>(`${this.resourceUrl}/addMultipleSections`, data);
  }
}
