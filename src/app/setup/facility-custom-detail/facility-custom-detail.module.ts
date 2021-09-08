/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FacilityCustomDetailRoutingModule } from "./facility-custom-detail-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { FacilityCustomDetailComponent } from "./facility-custom-detail.component";
import { FacilityCustomDetailUpdateComponent } from "./update/facility-custom-detail-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, FacilityCustomDetailRoutingModule],
  declarations: [
    FacilityCustomDetailComponent,
    FacilityCustomDetailUpdateComponent,
  ],
  entryComponents: [FacilityCustomDetailUpdateComponent],
})
export class FacilityCustomDetailModule {}
