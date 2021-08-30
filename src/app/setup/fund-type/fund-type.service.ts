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
import { FundType } from "./fund-type.model";

@Injectable({ providedIn: "root" })
export class FundTypeService {
  public resourceUrl = "api/fund_types";

  constructor(protected http: HttpClient) {}

  create(fundType: FundType): Observable<CustomResponse<FundType>> {
    return this.http.post<CustomResponse<FundType>>(this.resourceUrl, fundType);
  }

  update(fundType: FundType): Observable<CustomResponse<FundType>> {
    return this.http.put<CustomResponse<FundType>>(
      `${this.resourceUrl}/${fundType.id}`,
      fundType
    );
  }

  find(id: number): Observable<CustomResponse<FundType>> {
    return this.http.get<CustomResponse<FundType>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<FundType[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FundType[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
