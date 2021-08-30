/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BaselineStatisticRoutingModule } from "./baseline-statistic-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { BaselineStatisticComponent } from "./baseline-statistic.component";
import { BaselineStatisticUpdateComponent } from "./update/baseline-statistic-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, BaselineStatisticRoutingModule],
  declarations: [BaselineStatisticComponent, BaselineStatisticUpdateComponent],
  entryComponents: [BaselineStatisticUpdateComponent],
})
export class BaselineStatisticModule {}
