/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenericSectorProblemRoutingModule } from "./generic-sector-problem-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { GenericSectorProblemComponent } from "./generic-sector-problem.component";
import { GenericSectorProblemUpdateComponent } from "./update/generic-sector-problem-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, GenericSectorProblemRoutingModule],
  declarations: [
    GenericSectorProblemComponent,
    GenericSectorProblemUpdateComponent,
  ],
  entryComponents: [GenericSectorProblemUpdateComponent],
})
export class GenericSectorProblemModule {}
