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
import { ReportSetup } from "./report-setup.model";

@Injectable({ providedIn: "root" })
export class ReportSetupService {
  public resourceUrl = "api/reports";

  constructor(protected http: HttpClient) {}

  create(reportSetup: ReportSetup): Observable<CustomResponse<ReportSetup>> {
    return this.http.post<CustomResponse<ReportSetup>>(
      this.resourceUrl,
      reportSetup
    );
  }

  update(reportSetup: ReportSetup): Observable<CustomResponse<ReportSetup>> {
    return this.http.put<CustomResponse<ReportSetup>>(
      `${this.resourceUrl}/${reportSetup.id}`,
      reportSetup
    );
  }

  find(id: number): Observable<CustomResponse<ReportSetup>> {
    return this.http.get<CustomResponse<ReportSetup>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ReportSetup[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ReportSetup[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
