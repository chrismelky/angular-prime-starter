/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivityTaskNatureRoutingModule } from "./activity-task_nature-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ActivityTaskNatureComponent } from "./activity-task_nature.component";
import { ActivityTaskNatureUpdateComponent } from "./update/activity-task_nature-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ActivityTaskNatureRoutingModule],
  declarations: [
    ActivityTaskNatureComponent,
    ActivityTaskNatureUpdateComponent,
  ],
  entryComponents: [ActivityTaskNatureUpdateComponent],
})
export class ActivityTaskNatureModule {}
