/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { createRequestOption } from "../../utils/request-util";
import { CustomResponse } from "../../utils/custom-response";
import { Category } from "./category.model";

@Injectable({ providedIn: "root" })
export class CategoryService {
  public resourceUrl = "api/categories";

  constructor(protected http: HttpClient) {}

  create(category: Category): Observable<CustomResponse<Category>> {
    return this.http.post<CustomResponse<Category>>(this.resourceUrl, category);
  }

  update(category: Category): Observable<CustomResponse<Category>> {
    return this.http.put<CustomResponse<Category>>(
      `${this.resourceUrl}/${category.id}`,
      category
    );
  }

  find(id: number): Observable<CustomResponse<Category>> {
    return this.http.get<CustomResponse<Category>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Category[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Category[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
