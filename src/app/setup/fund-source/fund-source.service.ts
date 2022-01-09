/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {createRequestOption} from '../../utils/request-util';
import {CustomResponse} from '../../utils/custom-response';
import {FundSource} from './fund-source.model';
import {FundSourceCategory} from '../fund-source-category/fund-source-category.model';
import {ActivityFundSource} from 'src/app/planning/activity/activity.model';

@Injectable({providedIn: 'root'})
export class FundSourceService {
  public resourceUrl = 'api/fund_sources';

  constructor(protected http: HttpClient) {
  }

  create(fundSource: FundSource): Observable<CustomResponse<FundSource>> {
    return this.http.post<CustomResponse<FundSource>>(
      this.resourceUrl,
      fundSource
    );
  }

  update(fundSource: FundSource): Observable<CustomResponse<FundSource>> {
    return this.http.put<CustomResponse<FundSource>>(
      `${this.resourceUrl}/${fundSource.id}`,
      fundSource
    );
  }

  find(id: number): Observable<CustomResponse<FundSource>> {
    return this.http.get<CustomResponse<FundSource>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FundSource[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FundSource[]>>(this.resourceUrl, {
      params: options,
    });
  }

  queryCeilingSector(req?: any): Observable<CustomResponse<any[]>> {
    const options = createRequestOption(req);
    const url = 'api/ceiling_sectors';
    return this.http.get<CustomResponse<any[]>>(url, {
      params: options,
    });
  }

  createCeilingSector(payload: any): Observable<CustomResponse<FundSource>> {
    const url = 'api/ceiling_sectors';
    return this.http.post<CustomResponse<any>>(url, payload);
  }

  deleteCeilingSector(id: number): Observable<CustomResponse<null>> {
    const url = 'api/ceiling_sectors';
    return this.http.delete<CustomResponse<null>>(`${url}/${id}`);
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  getPeFundSource(): Observable<CustomResponse<any>> {
    return this.http.get<CustomResponse<any[]>>(
      `${this.resourceUrl}/get_pe_fund_source`
    );
  }

  getByBudgetClass(
    budgetClassId: number
  ): Observable<CustomResponse<FundSource[]>> {
    return this.http.get<CustomResponse<FundSource[]>>(
      `${this.resourceUrl}/by_budget_class/${budgetClassId}`
    );
  }

  upload(data: any): Observable<CustomResponse<FundSource[]>> {
    return this.http.post<CustomResponse<FundSource[]>>(
      this.resourceUrl + '/upload',
      data
    );
  }

  downloadTemplate(): any {
    return this.http.get(this.resourceUrl + '/downloadUploadTemplate', {
      responseType: 'arraybuffer',
    });
  }

  getByYearAndFacility(
    finacialYearId: number,
    facilityId: number
  ): Observable<CustomResponse<FundSource[]>> {
    return this.http.get<CustomResponse<FundSource[]>>(
      `api/activity_fund_sources/by_year_and_facility/${finacialYearId}/${facilityId}`
    );
  }

  download() {
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
    };
    let url = `${this.resourceUrl}/download`
    return this.http.get<any>(url, httpOptions);
  }
}
