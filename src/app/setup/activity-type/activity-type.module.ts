/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivityTypeRoutingModule } from "./activity-type-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ActivityTypeComponent } from "./activity-type.component";
import { ActivityTypeUpdateComponent } from "./update/activity-type-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ActivityTypeRoutingModule],
  declarations: [ActivityTypeComponent, ActivityTypeUpdateComponent],
  entryComponents: [ActivityTypeUpdateComponent],
})
export class ActivityTypeModule {}
