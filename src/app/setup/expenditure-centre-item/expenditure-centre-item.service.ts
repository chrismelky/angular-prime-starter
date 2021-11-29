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
import { ExpenditureCentreItem } from "./expenditure-centre-item.model";

@Injectable({ providedIn: "root" })
export class ExpenditureCentreItemService {
  public resourceUrl = "api/expenditure_centre_items";

  constructor(protected http: HttpClient) {}

  create(
    expenditureCentreItem: ExpenditureCentreItem
  ): Observable<CustomResponse<ExpenditureCentreItem>> {
    return this.http.post<CustomResponse<ExpenditureCentreItem>>(
      this.resourceUrl,
      expenditureCentreItem
    );
  }

  update(
    expenditureCentreItem: ExpenditureCentreItem
  ): Observable<CustomResponse<ExpenditureCentreItem>> {
    return this.http.put<CustomResponse<ExpenditureCentreItem>>(
      `${this.resourceUrl}/${expenditureCentreItem.id}`,
      expenditureCentreItem
    );
  }

  find(id: number): Observable<CustomResponse<ExpenditureCentreItem>> {
    return this.http.get<CustomResponse<ExpenditureCentreItem>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ExpenditureCentreItem[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ExpenditureCentreItem[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
