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
import { PeForm } from "./pe-form.model";

@Injectable({ providedIn: "root" })
export class PeFormService {
  public resourceUrl = "api/pe_forms";

  constructor(protected http: HttpClient) {}

  create(peForm: PeForm): Observable<CustomResponse<PeForm>> {
    return this.http.post<CustomResponse<PeForm>>(this.resourceUrl, peForm);
  }

  update(peForm: PeForm): Observable<CustomResponse<PeForm>> {
    return this.http.put<CustomResponse<PeForm>>(
      `${this.resourceUrl}/${peForm.id}`,
      peForm
    );
  }

  find(id: number): Observable<CustomResponse<PeForm>> {
    return this.http.get<CustomResponse<PeForm>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<PeForm[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<PeForm[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
