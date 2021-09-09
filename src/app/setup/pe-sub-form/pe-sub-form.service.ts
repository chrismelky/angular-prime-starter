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
import { PeSubForm } from "./pe-sub-form.model";

@Injectable({ providedIn: "root" })
export class PeSubFormService {
  public resourceUrl = "api/pe_sub_forms";

  constructor(protected http: HttpClient) {}

  create(peSubForm: PeSubForm): Observable<CustomResponse<PeSubForm>> {
    return this.http.post<CustomResponse<PeSubForm>>(
      this.resourceUrl,
      peSubForm
    );
  }

  update(peSubForm: PeSubForm): Observable<CustomResponse<PeSubForm>> {
    return this.http.put<CustomResponse<PeSubForm>>(
      `${this.resourceUrl}/${peSubForm.id}`,
      peSubForm
    );
  }

  find(id: number): Observable<CustomResponse<PeSubForm>> {
    return this.http.get<CustomResponse<PeSubForm>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<PeSubForm[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<PeSubForm[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  getParentChildren():Observable<CustomResponse<any>>{
    return this.http.get<CustomResponse<any[]>>(`${this.resourceUrl}/get_parent_children`);
  }

}
