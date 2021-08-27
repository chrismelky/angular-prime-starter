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
import { PeDefinition } from "./pe-definition.model";

@Injectable({ providedIn: "root" })
export class PeDefinitionService {
  public resourceUrl = "api/pe_definitions";

  constructor(protected http: HttpClient) {}

  create(peDefinition: PeDefinition): Observable<CustomResponse<PeDefinition>> {
    return this.http.post<CustomResponse<PeDefinition>>(
      this.resourceUrl,
      peDefinition
    );
  }

  update(peDefinition: PeDefinition): Observable<CustomResponse<PeDefinition>> {
    return this.http.put<CustomResponse<PeDefinition>>(
      `${this.resourceUrl}/${peDefinition.id}`,
      peDefinition
    );
  }

  find(id: number): Observable<CustomResponse<PeDefinition>> {
    return this.http.get<CustomResponse<PeDefinition>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<PeDefinition[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<PeDefinition[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
