/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivityTaskNatureRoutingModule } from "./activity-task-nature-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ActivityTaskNatureComponent } from "./activity-task-nature.component";
import { ActivityTaskNatureUpdateComponent } from "./update/activity-task-nature-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ActivityTaskNatureRoutingModule],
  declarations: [
    ActivityTaskNatureComponent,
    ActivityTaskNatureUpdateComponent,
  ],
  entryComponents: [ActivityTaskNatureUpdateComponent],
})
export class ActivityTaskNatureModule {}
