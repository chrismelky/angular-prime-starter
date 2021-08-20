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
import { AssetCondition } from "./asset-condition.model";

@Injectable({ providedIn: "root" })
export class AssetConditionService {
  public resourceUrl = "api/asset_conditions";

  constructor(protected http: HttpClient) {}

  create(
    assetCondition: AssetCondition
  ): Observable<CustomResponse<AssetCondition>> {
    return this.http.post<CustomResponse<AssetCondition>>(
      this.resourceUrl,
      assetCondition
    );
  }

  update(
    assetCondition: AssetCondition
  ): Observable<CustomResponse<AssetCondition>> {
    return this.http.put<CustomResponse<AssetCondition>>(
      `${this.resourceUrl}/${assetCondition.id}`,
      assetCondition
    );
  }

  find(id: number): Observable<CustomResponse<AssetCondition>> {
    return this.http.get<CustomResponse<AssetCondition>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<AssetCondition[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AssetCondition[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
