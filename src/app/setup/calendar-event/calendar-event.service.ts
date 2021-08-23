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
import { CalendarEvent } from "./calendar-event.model";

@Injectable({ providedIn: "root" })
export class CalendarEventService {
  public resourceUrl = "api/calendar_events";

  constructor(protected http: HttpClient) {}

  create(
    calendarEvent: CalendarEvent
  ): Observable<CustomResponse<CalendarEvent>> {
    return this.http.post<CustomResponse<CalendarEvent>>(
      this.resourceUrl,
      calendarEvent
    );
  }

  update(
    calendarEvent: CalendarEvent
  ): Observable<CustomResponse<CalendarEvent>> {
    return this.http.put<CustomResponse<CalendarEvent>>(
      `${this.resourceUrl}/${calendarEvent.id}`,
      calendarEvent
    );
  }

  find(id: number): Observable<CustomResponse<CalendarEvent>> {
    return this.http.get<CustomResponse<CalendarEvent>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<CalendarEvent[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CalendarEvent[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
