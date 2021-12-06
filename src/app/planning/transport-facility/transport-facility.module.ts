/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TransportFacilityRoutingModule } from "./transport-facility-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { TransportFacilityComponent } from "./transport-facility.component";
import { TransportFacilityUpdateComponent } from "./update/transport-facility-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, TransportFacilityRoutingModule],
  declarations: [TransportFacilityComponent, TransportFacilityUpdateComponent],
  entryComponents: [TransportFacilityUpdateComponent],
})
export class TransportFacilityModule {}
