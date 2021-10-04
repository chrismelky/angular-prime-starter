/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivityRoutingModule } from "./activity-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ActivityComponent } from "./activity.component";
import { ActivityUpdateComponent } from "./update/activity-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ActivityRoutingModule],
  declarations: [ActivityComponent, ActivityUpdateComponent],
  entryComponents: [ActivityUpdateComponent],
})
export class ActivityModule {}
