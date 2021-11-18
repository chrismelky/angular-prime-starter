/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProcurementTypeRoutingModule } from "./procurement-type-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ProcurementTypeComponent } from "./procurement-type.component";
import { ProcurementTypeUpdateComponent } from "./update/procurement-type-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ProcurementTypeRoutingModule],
  declarations: [ProcurementTypeComponent, ProcurementTypeUpdateComponent],
  entryComponents: [ProcurementTypeUpdateComponent],
})
export class ProcurementTypeModule {}
