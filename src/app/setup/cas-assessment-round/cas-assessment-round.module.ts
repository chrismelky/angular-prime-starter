/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasAssessmentRoundRoutingModule } from "./cas-assessment-round-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasAssessmentRoundComponent } from "./cas-assessment-round.component";
import { CasAssessmentRoundUpdateComponent } from "./update/cas-assessment-round-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CasAssessmentRoundRoutingModule],
  declarations: [
    CasAssessmentRoundComponent,
    CasAssessmentRoundUpdateComponent,
  ],
  entryComponents: [CasAssessmentRoundUpdateComponent],
})
export class CasAssessmentRoundModule {}
