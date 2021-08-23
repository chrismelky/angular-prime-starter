/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarEventRoutingModule } from "./calendar-event-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CalendarEventComponent } from "./calendar-event.component";
import { CalendarEventUpdateComponent } from "./update/calendar-event-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CalendarEventRoutingModule],
  declarations: [CalendarEventComponent, CalendarEventUpdateComponent],
  entryComponents: [CalendarEventUpdateComponent],
})
export class CalendarEventModule {}
