/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlanningMatrixRoutingModule } from "./planning-matrix-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { PlanningMatrixComponent } from "./planning-matrix.component";
import { PlanningMatrixUpdateComponent } from "./update/planning-matrix-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, PlanningMatrixRoutingModule],
  declarations: [PlanningMatrixComponent, PlanningMatrixUpdateComponent],
  entryComponents: [PlanningMatrixUpdateComponent],
})
export class PlanningMatrixModule {}
