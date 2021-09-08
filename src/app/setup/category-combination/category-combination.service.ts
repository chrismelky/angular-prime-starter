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
import { CategoryCombination } from './category-combination.model';

@Injectable({ providedIn: 'root' })
export class CategoryCombinationService {
  public resourceUrl = 'api/category_combinations';

  constructor(protected http: HttpClient) {}

  create(
    categoryCombination: CategoryCombination
  ): Observable<CustomResponse<CategoryCombination>> {
    return this.http.post<CustomResponse<CategoryCombination>>(
      this.resourceUrl,
      categoryCombination
    );
  }

  update(
    categoryCombination: CategoryCombination
  ): Observable<CustomResponse<CategoryCombination>> {
    return this.http.put<CustomResponse<CategoryCombination>>(
      `${this.resourceUrl}/${categoryCombination.id}`,
      categoryCombination
    );
  }

  find(id: number): Observable<CustomResponse<CategoryCombination>> {
    return this.http.get<CustomResponse<CategoryCombination>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CategoryCombination[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CategoryCombination[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  getByIds(req?: any): Observable<CustomResponse<CategoryCombination[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CategoryCombination[]>>(
      `${this.resourceUrl}/by_ids`,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
