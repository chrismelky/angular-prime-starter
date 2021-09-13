/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {createRequestOption} from "../../utils/request-util";
import {CustomResponse} from "../../utils/custom-response";
import {AdminHierarchyLevel} from "./admin-hierarchy-level.model";

@Injectable({providedIn: "root"})
export class AdminHierarchyLevelService {
  public resourceUrl = "api/admin_hierarchy_levels";

  constructor(protected http: HttpClient) {
  }

  create(
    adminHierarchyLevel: AdminHierarchyLevel
  ): Observable<CustomResponse<AdminHierarchyLevel>> {
    return this.http.post<CustomResponse<AdminHierarchyLevel>>(
      this.resourceUrl,
      adminHierarchyLevel
    );
  }

  update(
    adminHierarchyLevel: AdminHierarchyLevel
  ): Observable<CustomResponse<AdminHierarchyLevel>> {
    return this.http.put<CustomResponse<AdminHierarchyLevel>>(
      `${this.resourceUrl}/${adminHierarchyLevel.id}`,
      adminHierarchyLevel
    );
  }

  find(id: number): Observable<CustomResponse<AdminHierarchyLevel>> {
    return this.http.get<CustomResponse<AdminHierarchyLevel>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<AdminHierarchyLevel[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AdminHierarchyLevel[]>>(
      this.resourceUrl,
      {params: options}
    );
  }

  lowerLevels(currentPosition: number | undefined): Observable<CustomResponse<AdminHierarchyLevel[]>> {
    return this.http.get<CustomResponse<AdminHierarchyLevel[]>>(`${this.resourceUrl}/lowerLevels/${currentPosition}`,);
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
