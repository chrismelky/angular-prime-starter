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
import { GfsCode } from "./gfs-code.model";

@Injectable({ providedIn: "root" })
export class GfsCodeService {
  public resourceUrl = "api/gfs_codes";

  constructor(protected http: HttpClient) {
  }

  create(gfsCode: GfsCode): Observable<CustomResponse<GfsCode>> {
    return this.http.post<CustomResponse<GfsCode>>(this.resourceUrl, gfsCode);
  }

  update(gfsCode: GfsCode): Observable<CustomResponse<GfsCode>> {
    return this.http.put<CustomResponse<GfsCode>>(
      `${this.resourceUrl}/${gfsCode.id}`,
      gfsCode
    );
  }

  find(id: number): Observable<CustomResponse<GfsCode>> {
    return this.http.get<CustomResponse<GfsCode>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<GfsCode[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<GfsCode[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  queryRev(req?: any): Observable<CustomResponse<GfsCode[]>> {
    const options = createRequestOption(req);
    const url = '/api/gfs_codes/revenue';
    return this.http.get<CustomResponse<GfsCode[]>>(url, {
      params: options,
    });
  }

  upload(data: any): Observable<CustomResponse<GfsCode[]>> {
    return this.http.post<CustomResponse<GfsCode[]>>(this.resourceUrl + '/upload', data);
  }
}
