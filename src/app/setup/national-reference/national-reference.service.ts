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
import { NationalReference } from "./national-reference.model";

@Injectable({ providedIn: "root" })
export class NationalReferenceService {
  public resourceUrl = "api/national_references";

  constructor(protected http: HttpClient) {}

  create(
    nationalReference: NationalReference
  ): Observable<CustomResponse<NationalReference>> {
    return this.http.post<CustomResponse<NationalReference>>(
      this.resourceUrl,
      nationalReference
    );
  }

  update(
    nationalReference: NationalReference
  ): Observable<CustomResponse<NationalReference>> {
    return this.http.put<CustomResponse<NationalReference>>(
      `${this.resourceUrl}/${nationalReference.id}`,
      nationalReference
    );
  }

  find(id: number): Observable<CustomResponse<NationalReference>> {
    return this.http.get<CustomResponse<NationalReference>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<NationalReference[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<NationalReference[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
