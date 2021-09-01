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
import { TransportCategory } from "./transport-category.model";

@Injectable({ providedIn: "root" })
export class TransportCategoryService {
  public resourceUrl = "api/transport_categories";

  constructor(protected http: HttpClient) {}

  create(
    transportCategory: TransportCategory
  ): Observable<CustomResponse<TransportCategory>> {
    return this.http.post<CustomResponse<TransportCategory>>(
      this.resourceUrl,
      transportCategory
    );
  }

  update(
    transportCategory: TransportCategory
  ): Observable<CustomResponse<TransportCategory>> {
    return this.http.put<CustomResponse<TransportCategory>>(
      `${this.resourceUrl}/${transportCategory.id}`,
      transportCategory
    );
  }

  find(id: number): Observable<CustomResponse<TransportCategory>> {
    return this.http.get<CustomResponse<TransportCategory>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<TransportCategory[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<TransportCategory[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
