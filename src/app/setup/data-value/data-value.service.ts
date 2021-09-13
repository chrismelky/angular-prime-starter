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
import { DataValue } from './data-value.model';

@Injectable({ providedIn: 'root' })
export class DataValueService {
  public resourceUrl = 'api/data_values';

  constructor(protected http: HttpClient) {}

  create(dataValue: DataValue): Observable<CustomResponse<DataValue>> {
    return this.http.post<CustomResponse<DataValue>>(
      this.resourceUrl,
      dataValue
    );
  }

  upload(formDate: FormData): Observable<CustomResponse<DataValue>> {
    return this.http.post<CustomResponse<DataValue>>(
      `${this.resourceUrl}/upload`,
      formDate
    );
  }

  update(dataValue: DataValue): Observable<CustomResponse<DataValue>> {
    return this.http.put<CustomResponse<DataValue>>(
      `${this.resourceUrl}/${dataValue.id}`,
      dataValue
    );
  }

  find(id: number): Observable<CustomResponse<DataValue>> {
    return this.http.get<CustomResponse<DataValue>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<DataValue[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<DataValue[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
