/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarRoutingModule } from "./calendar-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CalendarComponent } from "./calendar.component";
import { CalendarUpdateComponent } from "./update/calendar-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CalendarRoutingModule],
  declarations: [CalendarComponent, CalendarUpdateComponent],
  entryComponents: [CalendarUpdateComponent],
})
export class CalendarModule {}
