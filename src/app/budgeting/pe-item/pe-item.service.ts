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
import { PeItem } from "./pe-item.model";

@Injectable({ providedIn: "root" })
export class PeItemService {
 // public resourceUrl = "api/pe_items";
  public resourceUrl = "api/pe_lines";

  constructor(protected http: HttpClient) {}


  create(payload: any): Observable<CustomResponse<any>> {

    return this.http.post<CustomResponse<any>>(this.resourceUrl, payload);
  }

  // create(peItem: PeItem): Observable<CustomResponse<PeItem>> {
  //   return this.http.post<CustomResponse<PeItem>>(this.resourceUrl, peItem);
  // }


  // update(peItem: PeItem): Observable<CustomResponse<PeItem>> {
  //   return this.http.put<CustomResponse<PeItem>>(
  //     `${this.resourceUrl}/${peItem.id}`,
  //     peItem
  //   );
  // }

  find(id: number): Observable<CustomResponse<PeItem>> {
    return this.http.get<CustomResponse<PeItem>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<PeItem[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<PeItem[]>>(this.resourceUrl, {
      params: options,
    });
  }

  // delete(id: number): Observable<CustomResponse<null>> {
  //   return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  // }
}
