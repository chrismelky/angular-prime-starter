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
import { InterventionCategory } from "./intervention-category.model";

@Injectable({ providedIn: "root" })
export class InterventionCategoryService {
  public resourceUrl = "api/intervention_categories";

  constructor(protected http: HttpClient) {}

  create(
    interventionCategory: InterventionCategory
  ): Observable<CustomResponse<InterventionCategory>> {
    return this.http.post<CustomResponse<InterventionCategory>>(
      this.resourceUrl,
      interventionCategory
    );
  }

  update(
    interventionCategory: InterventionCategory
  ): Observable<CustomResponse<InterventionCategory>> {
    return this.http.put<CustomResponse<InterventionCategory>>(
      `${this.resourceUrl}/${interventionCategory.id}`,
      interventionCategory
    );
  }

  find(id: number): Observable<CustomResponse<InterventionCategory>> {
    return this.http.get<CustomResponse<InterventionCategory>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<InterventionCategory[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<InterventionCategory[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
