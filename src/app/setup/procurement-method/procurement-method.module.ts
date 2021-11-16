/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProcurementMethodRoutingModule } from "./procurement-method-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ProcurementMethodComponent } from "./procurement-method.component";
import { ProcurementMethodUpdateComponent } from "./update/procurement-method-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ProcurementMethodRoutingModule],
  declarations: [ProcurementMethodComponent, ProcurementMethodUpdateComponent],
  entryComponents: [ProcurementMethodUpdateComponent],
})
export class ProcurementMethodModule {}
