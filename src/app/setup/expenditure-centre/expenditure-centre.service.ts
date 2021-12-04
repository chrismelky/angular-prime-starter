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
import { ExpenditureCentre } from "./expenditure-centre.model";

@Injectable({ providedIn: "root" })
export class ExpenditureCentreService {
  public resourceUrl = "api/expenditure_centres";

  constructor(protected http: HttpClient) {}

  create(
    expenditureCentre: ExpenditureCentre
  ): Observable<CustomResponse<ExpenditureCentre>> {
    return this.http.post<CustomResponse<ExpenditureCentre>>(
      this.resourceUrl,
      expenditureCentre
    );
  }

  update(
    expenditureCentre: ExpenditureCentre
  ): Observable<CustomResponse<ExpenditureCentre>> {
    return this.http.put<CustomResponse<ExpenditureCentre>>(
      `${this.resourceUrl}/${expenditureCentre.id}`,
      expenditureCentre
    );
  }

  find(id: number): Observable<CustomResponse<ExpenditureCentre>> {
    return this.http.get<CustomResponse<ExpenditureCentre>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ExpenditureCentre[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ExpenditureCentre[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
