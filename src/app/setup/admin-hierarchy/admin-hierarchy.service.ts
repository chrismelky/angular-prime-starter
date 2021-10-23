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
import { AdminHierarchy, AdminHierarchyTarget } from './admin-hierarchy.model';

@Injectable({ providedIn: 'root' })
export class AdminHierarchyService {
  public resourceUrl = 'api/admin_hierarchies';

  constructor(protected http: HttpClient) {}

  create(
    adminHierarchy: AdminHierarchy
  ): Observable<CustomResponse<AdminHierarchy>> {
    return this.http.post<CustomResponse<AdminHierarchy>>(
      this.resourceUrl,
      adminHierarchy
    );
  }

  update(
    adminHierarchy: AdminHierarchy
  ): Observable<CustomResponse<AdminHierarchy>> {
    return this.http.put<CustomResponse<AdminHierarchy>>(
      `${this.resourceUrl}/${adminHierarchy.id}`,
      adminHierarchy
    );
  }

  find(id: number): Observable<CustomResponse<AdminHierarchy>> {
    return this.http.get<CustomResponse<AdminHierarchy>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<AdminHierarchy[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AdminHierarchy[]>>(this.resourceUrl, {
      params: options,
    });
  }

  queryByPositionAndParent(
    req?: any
  ): Observable<CustomResponse<AdminHierarchy[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AdminHierarchy[]>>(
      `${this.resourceUrl}/search/${req.position}/${req.parent}/${req.parentId}`,
      {
        params: options,
      }
    );
  }

  withTargets(req?: any): Observable<CustomResponse<AdminHierarchyTarget[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AdminHierarchyTarget[]>>(
      `${this.resourceUrl}/with_financial_year_target`,
      {
        params: options,
      }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
