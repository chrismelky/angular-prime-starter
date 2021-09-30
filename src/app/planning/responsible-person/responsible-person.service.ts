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
import { ResponsiblePerson } from "./responsible-person.model";

@Injectable({ providedIn: "root" })
export class ResponsiblePersonService {
  public resourceUrl = "api/responsible_people";

  constructor(protected http: HttpClient) {}

  create(
    responsiblePerson: ResponsiblePerson
  ): Observable<CustomResponse<ResponsiblePerson>> {
    return this.http.post<CustomResponse<ResponsiblePerson>>(
      this.resourceUrl,
      responsiblePerson
    );
  }

  update(
    responsiblePerson: ResponsiblePerson
  ): Observable<CustomResponse<ResponsiblePerson>> {
    return this.http.put<CustomResponse<ResponsiblePerson>>(
      `${this.resourceUrl}/${responsiblePerson.id}`,
      responsiblePerson
    );
  }

  find(id: number): Observable<CustomResponse<ResponsiblePerson>> {
    return this.http.get<CustomResponse<ResponsiblePerson>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ResponsiblePerson[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ResponsiblePerson[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
