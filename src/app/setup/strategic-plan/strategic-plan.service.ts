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
import { StrategicPlan } from './strategic-plan.model';

@Injectable({ providedIn: 'root' })
export class StrategicPlanService {
  public resourceUrl = 'api/strategic_plans';
  public downloadUrl = 'api/download_strategic_plans';

  constructor(protected http: HttpClient) {}

  create(strategicPlan: FormData): Observable<CustomResponse<StrategicPlan>> {
    return this.http.post<CustomResponse<StrategicPlan>>(
      this.resourceUrl,
      strategicPlan
    );
  }

  /**
   * Post is use
   * @param strategicPlan
   * @returns
   */
  update(strategicPlan: FormData): Observable<CustomResponse<StrategicPlan>> {
    return this.http.post<CustomResponse<StrategicPlan>>(
      `${this.resourceUrl}/${strategicPlan.get('id')}`,
      strategicPlan
    );
  }

  find(id: number): Observable<CustomResponse<StrategicPlan>> {
    return this.http.get<CustomResponse<StrategicPlan>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<StrategicPlan[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<StrategicPlan[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  download(id: number) {
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
    };
    return this.http.get<any>(
      `${this.resourceUrl}/download/${id}`,
      httpOptions
    );
  }
}
