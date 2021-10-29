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
import { ReferenceType } from './reference-type.model';

@Injectable({ providedIn: 'root' })
export class ReferenceTypeService {
  public resourceUrl = 'api/reference_types';

  constructor(protected http: HttpClient) {}

  create(
    referenceType: ReferenceType
  ): Observable<CustomResponse<ReferenceType>> {
    return this.http.post<CustomResponse<ReferenceType>>(
      this.resourceUrl,
      referenceType
    );
  }

  update(
    referenceType: ReferenceType
  ): Observable<CustomResponse<ReferenceType>> {
    return this.http.put<CustomResponse<ReferenceType>>(
      `${this.resourceUrl}/${referenceType.id}`,
      referenceType
    );
  }

  find(id: number): Observable<CustomResponse<ReferenceType>> {
    return this.http.get<CustomResponse<ReferenceType>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ReferenceType[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ReferenceType[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  byLinkLevelWithReferences(
    linkLevel: string,
    sectorId: number,
    req?: any
  ): Observable<CustomResponse<ReferenceType[]>> {
    const options = createRequestOption(req);

    return this.http.get<CustomResponse<ReferenceType[]>>(
      `${this.resourceUrl}/with_references/${linkLevel}/${sectorId}`,
      {
        params: options,
      }
    );
  }
}
