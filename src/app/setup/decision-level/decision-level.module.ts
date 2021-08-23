/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DecisionLevelRoutingModule } from "./decision-level-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { DecisionLevelComponent } from "./decision-level.component";
import { DecisionLevelUpdateComponent } from "./update/decision-level-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, DecisionLevelRoutingModule],
  declarations: [DecisionLevelComponent, DecisionLevelUpdateComponent],
  entryComponents: [DecisionLevelUpdateComponent],
})
export class DecisionLevelModule {}
