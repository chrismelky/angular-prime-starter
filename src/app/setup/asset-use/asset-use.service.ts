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
import { AssetUse } from "./asset-use.model";

@Injectable({ providedIn: "root" })
export class AssetUseService {
  public resourceUrl = "api/asset_uses";

  constructor(protected http: HttpClient) {}

  create(assetUse: AssetUse): Observable<CustomResponse<AssetUse>> {
    return this.http.post<CustomResponse<AssetUse>>(this.resourceUrl, assetUse);
  }

  update(assetUse: AssetUse): Observable<CustomResponse<AssetUse>> {
    return this.http.put<CustomResponse<AssetUse>>(
      `${this.resourceUrl}/${assetUse.id}`,
      assetUse
    );
  }

  find(id: number): Observable<CustomResponse<AssetUse>> {
    return this.http.get<CustomResponse<AssetUse>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<AssetUse[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AssetUse[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
