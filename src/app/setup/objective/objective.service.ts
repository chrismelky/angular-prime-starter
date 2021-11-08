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
import { Objective } from './objective.model';

@Injectable({ providedIn: 'root' })
export class ObjectiveService {
  public resourceUrl = 'api/objectives';

  constructor(protected http: HttpClient) {}

  create(objective: Objective): Observable<CustomResponse<Objective>> {
    return this.http.post<CustomResponse<Objective>>(
      this.resourceUrl,
      objective
    );
  }

  update(objective: Objective): Observable<CustomResponse<Objective>> {
    return this.http.put<CustomResponse<Objective>>(
      `${this.resourceUrl}/${objective.id}`,
      objective
    );
  }

  find(id: number): Observable<CustomResponse<Objective>> {
    return this.http.get<CustomResponse<Objective>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<Objective[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Objective[]>>(this.resourceUrl, {
      params: options,
    });
  }

  tree(req?: any): Observable<CustomResponse<Objective[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Objective[]>>(
      `${this.resourceUrl}/tree`,
      {
        params: options,
      }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
