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
import { Report } from "./report.model";

@Injectable({ providedIn: "root" })
export class ReportService {
  public resourceUrl = "api/reports";

  constructor(protected http: HttpClient) {}

  create(report: Report): Observable<CustomResponse<Report>> {
    return this.http.post<CustomResponse<Report>>(this.resourceUrl, report);
  }

  update(report: Report): Observable<CustomResponse<Report>> {
    return this.http.put<CustomResponse<Report>>(
      `${this.resourceUrl}/${report.id}`,
      report
    );
  }

  find(id: number): Observable<CustomResponse<Report>> {
    return this.http.get<CustomResponse<Report>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Report[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Report[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  getReport(req?: any) {
    const options = createRequestOption(req);
    return this.http.get<any>(`${this.resourceUrl}/get_report`, {
      params: options,
      responseType  : 'arraybuffer' as 'json'
    });
  }

  getParams(id: number): Observable<CustomResponse<Report[]>> {
    return this.http.get<CustomResponse<Report[]>>(`${this.resourceUrl}/get_params/${id}`);
  }
}
