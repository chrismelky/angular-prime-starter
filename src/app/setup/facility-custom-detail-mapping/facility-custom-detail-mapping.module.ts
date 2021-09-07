/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FacilityCustomDetailMappingRoutingModule } from "./facility-custom-detail-mapping-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { FacilityCustomDetailMappingComponent } from "./facility-custom-detail-mapping.component";
import { FacilityCustomDetailMappingUpdateComponent } from "./update/facility-custom-detail-mapping-update.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FacilityCustomDetailMappingRoutingModule,
  ],
  declarations: [
    FacilityCustomDetailMappingComponent,
    FacilityCustomDetailMappingUpdateComponent,
  ],
  entryComponents: [FacilityCustomDetailMappingUpdateComponent],
})
export class FacilityCustomDetailMappingModule {}
