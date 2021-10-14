/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivityInputRoutingModule } from "./activity-input-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ActivityInputComponent } from "./activity-input.component";
import { ActivityInputUpdateComponent } from "./update/activity-input-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ActivityInputRoutingModule],
  declarations: [ActivityInputComponent, ActivityInputUpdateComponent],
  entryComponents: [ActivityInputUpdateComponent],
})
export class ActivityInputModule {}
