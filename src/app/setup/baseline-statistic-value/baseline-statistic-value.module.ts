/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BaselineStatisticValueRoutingModule } from "./baseline-statistic-value-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { BaselineStatisticValueComponent } from "./baseline-statistic-value.component";
import { BaselineStatisticValueUpdateComponent } from "./update/baseline-statistic-value-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, BaselineStatisticValueRoutingModule],
  declarations: [
    BaselineStatisticValueComponent,
    BaselineStatisticValueUpdateComponent,
  ],
  entryComponents: [BaselineStatisticValueUpdateComponent],
})
export class BaselineStatisticValueModule {}
