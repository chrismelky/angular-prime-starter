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
import { OptionSet } from "./option-set.model";

@Injectable({ providedIn: "root" })
export class OptionSetService {
  public resourceUrl = "api/option_sets";

  constructor(protected http: HttpClient) {}

  create(optionSet: OptionSet): Observable<CustomResponse<OptionSet>> {
    return this.http.post<CustomResponse<OptionSet>>(
      this.resourceUrl,
      optionSet
    );
  }

  update(optionSet: OptionSet): Observable<CustomResponse<OptionSet>> {
    return this.http.put<CustomResponse<OptionSet>>(
      `${this.resourceUrl}/${optionSet.id}`,
      optionSet
    );
  }

  find(id: number): Observable<CustomResponse<OptionSet>> {
    return this.http.get<CustomResponse<OptionSet>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<OptionSet[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<OptionSet[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
