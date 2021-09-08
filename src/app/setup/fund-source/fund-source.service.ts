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
import { FundSource } from "./fund-source.model";

@Injectable({ providedIn: "root" })
export class FundSourceService {
  public resourceUrl = "api/fund_sources";

  constructor(protected http: HttpClient) {}

  create(fundSource: FundSource): Observable<CustomResponse<FundSource>> {
    return this.http.post<CustomResponse<FundSource>>(
      this.resourceUrl,
      fundSource
    );
  }

  update(fundSource: FundSource): Observable<CustomResponse<FundSource>> {
    return this.http.put<CustomResponse<FundSource>>(
      `${this.resourceUrl}/${fundSource.id}`,
      fundSource
    );
  }

  find(id: number): Observable<CustomResponse<FundSource>> {
    return this.http.get<CustomResponse<FundSource>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FundSource[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FundSource[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  getPeFundSource():Observable<CustomResponse<any>>{
    return this.http.get<CustomResponse<any[]>>(`${this.resourceUrl}/get_pe_fund_source`);
  }
}
