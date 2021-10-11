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
import { GenericSectorProblem } from './generic-sector-problem.model';

@Injectable({ providedIn: 'root' })
export class GenericSectorProblemService {
  public resourceUrl = 'api/generic_sector_problems';

  constructor(protected http: HttpClient) {}

  create(
    genericSectorProblem: GenericSectorProblem
  ): Observable<CustomResponse<GenericSectorProblem>> {
    return this.http.post<CustomResponse<GenericSectorProblem>>(
      this.resourceUrl,
      genericSectorProblem
    );
  }

  update(
    genericSectorProblem: GenericSectorProblem
  ): Observable<CustomResponse<GenericSectorProblem>> {
    return this.http.put<CustomResponse<GenericSectorProblem>>(
      `${this.resourceUrl}/${genericSectorProblem.id}`,
      genericSectorProblem
    );
  }

  find(id: number): Observable<CustomResponse<GenericSectorProblem>> {
    return this.http.get<CustomResponse<GenericSectorProblem>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<GenericSectorProblem[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<GenericSectorProblem[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
