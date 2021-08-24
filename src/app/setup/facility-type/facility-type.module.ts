/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FacilityTypeRoutingModule } from "./facility-type-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { FacilityTypeComponent } from "./facility-type.component";
import { FacilityTypeUpdateComponent } from "./update/facility-type-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, FacilityTypeRoutingModule],
  declarations: [FacilityTypeComponent, FacilityTypeUpdateComponent],
  entryComponents: [FacilityTypeUpdateComponent],
})
export class FacilityTypeModule {}
