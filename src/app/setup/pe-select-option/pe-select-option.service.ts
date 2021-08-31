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
import { PeSelectOption } from "./pe-select-option.model";

@Injectable({ providedIn: "root" })
export class PeSelectOptionService {
  public resourceUrl = "api/pe_select_options";

  constructor(protected http: HttpClient) {}

  create(
    peSelectOption: PeSelectOption
  ): Observable<CustomResponse<PeSelectOption>> {
    return this.http.post<CustomResponse<PeSelectOption>>(
      this.resourceUrl,
      peSelectOption
    );
  }

  update(
    peSelectOption: PeSelectOption
  ): Observable<CustomResponse<PeSelectOption>> {
    return this.http.put<CustomResponse<PeSelectOption>>(
      `${this.resourceUrl}/${peSelectOption.id}`,
      peSelectOption
    );
  }

  find(id: number): Observable<CustomResponse<PeSelectOption>> {
    return this.http.get<CustomResponse<PeSelectOption>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<PeSelectOption[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<PeSelectOption[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
