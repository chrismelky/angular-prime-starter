/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasPlanRoutingModule } from "./cas-plan-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasPlanComponent } from "./cas-plan.component";
import { CasPlanUpdateComponent } from "./update/cas-plan-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CasPlanRoutingModule],
  declarations: [CasPlanComponent, CasPlanUpdateComponent],
  entryComponents: [CasPlanUpdateComponent],
})
export class CasPlanModule {}
