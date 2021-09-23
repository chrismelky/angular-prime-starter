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
import { FinancialYear } from './financial-year.model';

@Injectable({ providedIn: 'root' })
export class FinancialYearService {
  public resourceUrl = 'api/financial_years';

  constructor(protected http: HttpClient) {}

  create(
    financialYear: FinancialYear
  ): Observable<CustomResponse<FinancialYear>> {
    return this.http.post<CustomResponse<FinancialYear>>(
      this.resourceUrl,
      financialYear
    );
  }

  update(
    financialYear: FinancialYear
  ): Observable<CustomResponse<FinancialYear>> {
    return this.http.put<CustomResponse<FinancialYear>>(
      `${this.resourceUrl}/${financialYear.id}`,
      financialYear
    );
  }

  find(id: number): Observable<CustomResponse<FinancialYear>> {
    return this.http.get<CustomResponse<FinancialYear>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FinancialYear[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FinancialYear[]>>(this.resourceUrl, {
      params: options,
    });
  }

  byRange(
    startFinancialYearId: number,
    endFinancialYearId: number
  ): Observable<CustomResponse<FinancialYear[]>> {
    return this.http.get<CustomResponse<FinancialYear[]>>(
      `${this.resourceUrl}/by_range/${startFinancialYearId}/${endFinancialYearId}`
    );
  }

  findByStatus(status: number): Observable<CustomResponse<FinancialYear>> {
    return this.http.get<CustomResponse<FinancialYear>>(
      `${this.resourceUrl}/by_status/${status}`
    );
  }

  openPreRequisite(id: number): Observable<CustomResponse<FinancialYear>> {
    return this.http.get<CustomResponse<FinancialYear>>(
      `${this.resourceUrl}/open_pre_requisite/${id}`
    );
  }

  open(id: number): Observable<CustomResponse<FinancialYear>> {
    return this.http.get<CustomResponse<FinancialYear>>(
      `${this.resourceUrl}/open/${id}`
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
