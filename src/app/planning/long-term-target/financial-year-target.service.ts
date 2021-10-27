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
import { FinancialYearTarget } from './financial-year-target.model';

@Injectable({ providedIn: 'root' })
export class FinancialYearTargetService {
  public resourceUrl = 'api/financial_year_targets';

  constructor(protected http: HttpClient) {}

  create(
    financialYearTarget: FinancialYearTarget
  ): Observable<CustomResponse<FinancialYearTarget>> {
    return this.http.post<CustomResponse<FinancialYearTarget>>(
      this.resourceUrl,
      financialYearTarget
    );
  }

  update(
    financialYearTarget: FinancialYearTarget
  ): Observable<CustomResponse<FinancialYearTarget>> {
    return this.http.put<CustomResponse<FinancialYearTarget>>(
      `${this.resourceUrl}/${financialYearTarget.id}`,
      financialYearTarget
    );
  }

  find(id: number): Observable<CustomResponse<FinancialYearTarget>> {
    return this.http.get<CustomResponse<FinancialYearTarget>>(
      `${this.resourceUrl}/${id}`
    );
  }

  findByTargetAndAdminArea(
    longTermTargetId: number,
    financialYearId: number,
    adminHierarchyId: number,
    sectionId: number
  ): Observable<CustomResponse<FinancialYearTarget>> {
    return this.http.get<CustomResponse<FinancialYearTarget>>(
      `${this.resourceUrl}/by_target_and_admin_area/${longTermTargetId}/${financialYearId}/${adminHierarchyId}/${sectionId}`
    );
  }

  allByCostCentre(
    financialYearId: number,
    adminHierarchyId: number,
    costCentreId: number
  ): Observable<CustomResponse<FinancialYearTarget[]>> {
    return this.http.get<CustomResponse<FinancialYearTarget[]>>(
      `${this.resourceUrl}/all_by_cost_centre/${financialYearId}/${adminHierarchyId}/${costCentreId}`
    );
  }

  query(req?: any): Observable<CustomResponse<FinancialYearTarget[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FinancialYearTarget[]>>(
      this.resourceUrl,
      {
        params: options,
      }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
