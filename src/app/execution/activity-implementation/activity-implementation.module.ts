/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivityImplementationRoutingModule } from "./activity-implementation-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ActivityImplementationComponent } from "./activity-implementation.component";
import { ActivityImplementationUpdateComponent } from "./update/activity-implementation-update.component";
import {ActivityImplementationEvidenceComponent} from "./update/activity-implementation-evidence.component";
import {ActivityImplementationHistoryComponent} from "./update/activity-implementation-history.component";

@NgModule({
  imports: [SharedModule, CommonModule, ActivityImplementationRoutingModule],
  declarations: [
    ActivityImplementationComponent,
    ActivityImplementationUpdateComponent,
    ActivityImplementationHistoryComponent,
    ActivityImplementationEvidenceComponent
  ],
  entryComponents: [ActivityImplementationUpdateComponent,ActivityImplementationEvidenceComponent,ActivityImplementationHistoryComponent],
})
export class ActivityImplementationModule {}