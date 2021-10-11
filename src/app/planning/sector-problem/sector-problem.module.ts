/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SectorProblemRoutingModule } from "./sector-problem-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { SectorProblemComponent } from "./sector-problem.component";
import { SectorProblemUpdateComponent } from "./update/sector-problem-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, SectorProblemRoutingModule],
  declarations: [SectorProblemComponent, SectorProblemUpdateComponent],
  entryComponents: [SectorProblemUpdateComponent],
})
export class SectorProblemModule {}
