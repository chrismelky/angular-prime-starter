/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { createRequestOption } from '../../utils/request-util';
import { CustomResponse } from '../../utils/custom-response';
import { AdminHierarchyCostCentre } from './admin-hierarchy-cost-centre.model';

@Injectable({ providedIn: 'root' })
export class AdminHierarchyCostCentreService {
  public resourceUrl = 'api/admin_hierarchy_cost_centres';

  constructor(protected http: HttpClient) {}

  create(
    adminHierarchyCostCentres: AdminHierarchyCostCentre
  ): Observable<CustomResponse<AdminHierarchyCostCentre>> {
    return this.http.post<CustomResponse<AdminHierarchyCostCentre>>(
      this.resourceUrl,
      adminHierarchyCostCentres
    );
  }

  update(
    adminHierarchyCostCentres: AdminHierarchyCostCentre
  ): Observable<CustomResponse<AdminHierarchyCostCentre>> {
    return this.http.put<CustomResponse<AdminHierarchyCostCentre>>(
      `${this.resourceUrl}/${adminHierarchyCostCentres.id}`,
      adminHierarchyCostCentres
    );
  }

  find(
    id: number,
    req?: any
  ): Observable<CustomResponse<AdminHierarchyCostCentre>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AdminHierarchyCostCentre>>(
      `${this.resourceUrl}/${id}`,
      { params: options }
    );
  }

  query(req?: any): Observable<CustomResponse<AdminHierarchyCostCentre[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AdminHierarchyCostCentre[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
