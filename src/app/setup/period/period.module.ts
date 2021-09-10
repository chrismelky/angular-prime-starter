/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PeriodRoutingModule } from "./period-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { PeriodComponent } from "./period.component";
import { PeriodUpdateComponent } from "./update/period-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, PeriodRoutingModule],
  declarations: [PeriodComponent, PeriodUpdateComponent],
  entryComponents: [PeriodUpdateComponent],
})
export class PeriodModule {}
