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
import { Group } from "./group.model";

@Injectable({ providedIn: "root" })
export class GroupService {
  public resourceUrl = "api/groups";

  constructor(protected http: HttpClient) {}

  create(group: Group): Observable<CustomResponse<Group>> {
    return this.http.post<CustomResponse<Group>>(this.resourceUrl, group);
  }

  update(group: Group): Observable<CustomResponse<Group>> {
    return this.http.put<CustomResponse<Group>>(
      `${this.resourceUrl}/${group.id}`,
      group
    );
  }

  find(id: number): Observable<CustomResponse<Group>> {
    return this.http.get<CustomResponse<Group>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Group[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Group[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
