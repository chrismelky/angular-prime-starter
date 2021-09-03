/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PriorityAreaRoutingModule } from "./priority-area-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { PriorityAreaComponent } from "./priority-area.component";
import { PriorityAreaUpdateComponent } from "./update/priority-area-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, PriorityAreaRoutingModule],
  declarations: [PriorityAreaComponent, PriorityAreaUpdateComponent],
  entryComponents: [PriorityAreaUpdateComponent],
})
export class PriorityAreaModule {}
