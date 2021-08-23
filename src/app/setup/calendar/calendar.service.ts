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
import { Calendar } from "./calendar.model";

@Injectable({ providedIn: "root" })
export class CalendarService {
  public resourceUrl = "api/calendars";

  constructor(protected http: HttpClient) {}

  create(calendar: Calendar): Observable<CustomResponse<Calendar>> {
    return this.http.post<CustomResponse<Calendar>>(this.resourceUrl, calendar);
  }

  update(calendar: Calendar): Observable<CustomResponse<Calendar>> {
    return this.http.put<CustomResponse<Calendar>>(
      `${this.resourceUrl}/${calendar.id}`,
      calendar
    );
  }

  find(id: number): Observable<CustomResponse<Calendar>> {
    return this.http.get<CustomResponse<Calendar>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Calendar[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Calendar[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
