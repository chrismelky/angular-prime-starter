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
import { Advertisement } from "./advertisement.model";

@Injectable({ providedIn: "root" })
export class AdvertisementService {
  public resourceUrl = "api/advertisements";

  constructor(protected http: HttpClient) {}

  create(
    advertisement: Advertisement
  ): Observable<CustomResponse<Advertisement>> {
    return this.http.post<CustomResponse<Advertisement>>(
      this.resourceUrl,
      advertisement
    );
  }

  update(
    advertisement: Advertisement
  ): Observable<CustomResponse<Advertisement>> {
    return this.http.put<CustomResponse<Advertisement>>(
      `${this.resourceUrl}/${advertisement.id}`,
      advertisement
    );
  }

  find(id: number): Observable<CustomResponse<Advertisement>> {
    return this.http.get<CustomResponse<Advertisement>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<Advertisement[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Advertisement[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
