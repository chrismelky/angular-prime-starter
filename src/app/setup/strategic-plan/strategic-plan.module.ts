/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StrategicPlanRoutingModule } from "./strategic-plan-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { StrategicPlanComponent } from "./strategic-plan.component";
import { StrategicPlanUpdateComponent } from "./update/strategic-plan-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, StrategicPlanRoutingModule],
  declarations: [StrategicPlanComponent, StrategicPlanUpdateComponent],
  entryComponents: [StrategicPlanUpdateComponent],
})
export class StrategicPlanModule {}
