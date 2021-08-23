/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PeriodGroupRoutingModule } from "./period-group-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { PeriodGroupComponent } from "./period-group.component";
import { PeriodGroupUpdateComponent } from "./update/period-group-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, PeriodGroupRoutingModule],
  declarations: [PeriodGroupComponent, PeriodGroupUpdateComponent],
  entryComponents: [PeriodGroupUpdateComponent],
})
export class PeriodGroupModule {}
