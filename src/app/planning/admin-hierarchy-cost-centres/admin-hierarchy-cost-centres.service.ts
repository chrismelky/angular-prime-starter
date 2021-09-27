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
import { AdminHierarchyCostCentres } from "./admin-hierarchy-cost-centres.model";

@Injectable({ providedIn: "root" })
export class AdminHierarchyCostCentresService {
  public resourceUrl = "api/admin_hierarchy_cost_centres";

  constructor(protected http: HttpClient) {}

  create(
    adminHierarchyCostCentres: AdminHierarchyCostCentres
  ): Observable<CustomResponse<AdminHierarchyCostCentres>> {
    return this.http.post<CustomResponse<AdminHierarchyCostCentres>>(
      this.resourceUrl,
      adminHierarchyCostCentres
    );
  }

  update(
    adminHierarchyCostCentres: AdminHierarchyCostCentres
  ): Observable<CustomResponse<AdminHierarchyCostCentres>> {
    return this.http.put<CustomResponse<AdminHierarchyCostCentres>>(
      `${this.resourceUrl}/${adminHierarchyCostCentres.id}`,
      adminHierarchyCostCentres
    );
  }

  find(id: number): Observable<CustomResponse<AdminHierarchyCostCentres>> {
    return this.http.get<CustomResponse<AdminHierarchyCostCentres>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<AdminHierarchyCostCentres[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AdminHierarchyCostCentres[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
