/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FacilityCustomDetailValueRoutingModule } from "./facility-custom-detail-value-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { FacilityCustomDetailValueComponent } from "./facility-custom-detail-value.component";
import { FacilityCustomDetailValueUpdateComponent } from "./update/facility-custom-detail-value-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, FacilityCustomDetailValueRoutingModule],
  declarations: [
    FacilityCustomDetailValueComponent,
    FacilityCustomDetailValueUpdateComponent,
  ],
  entryComponents: [FacilityCustomDetailValueUpdateComponent],
})
export class FacilityCustomDetailValueModule {}
