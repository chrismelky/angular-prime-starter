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
import { CasPlanContent } from "./cas-plan-content.model";

@Injectable({ providedIn: "root" })
export class CasPlanContentService {
  public resourceUrl = "api/cas_plan_contents";

  constructor(protected http: HttpClient) {}

  create(
    casPlanContent: CasPlanContent
  ): Observable<CustomResponse<CasPlanContent>> {
    return this.http.post<CustomResponse<CasPlanContent>>(
      this.resourceUrl,
      casPlanContent
    );
  }

  update(
    casPlanContent: CasPlanContent
  ): Observable<CustomResponse<CasPlanContent>> {
    return this.http.put<CustomResponse<CasPlanContent>>(
      `${this.resourceUrl}/${casPlanContent.id}`,
      casPlanContent
    );
  }

  find(id: number): Observable<CustomResponse<CasPlanContent>> {
    return this.http.get<CustomResponse<CasPlanContent>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CasPlanContent[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CasPlanContent[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
