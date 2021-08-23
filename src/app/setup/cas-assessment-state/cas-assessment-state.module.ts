/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasAssessmentStateRoutingModule } from "./cas-assessment-state-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasAssessmentStateComponent } from "./cas-assessment-state.component";
import { CasAssessmentStateUpdateComponent } from "./update/cas-assessment-state-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CasAssessmentStateRoutingModule],
  declarations: [
    CasAssessmentStateComponent,
    CasAssessmentStateUpdateComponent,
  ],
  entryComponents: [CasAssessmentStateUpdateComponent],
})
export class CasAssessmentStateModule {}
