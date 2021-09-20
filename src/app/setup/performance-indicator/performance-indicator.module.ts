/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PerformanceIndicatorRoutingModule } from "./performance-indicator-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { PerformanceIndicatorComponent } from "./performance-indicator.component";
import { PerformanceIndicatorUpdateComponent } from "./update/performance-indicator-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, PerformanceIndicatorRoutingModule],
  declarations: [
    PerformanceIndicatorComponent,
    PerformanceIndicatorUpdateComponent,
  ],
  entryComponents: [PerformanceIndicatorUpdateComponent],
})
export class PerformanceIndicatorModule {}
