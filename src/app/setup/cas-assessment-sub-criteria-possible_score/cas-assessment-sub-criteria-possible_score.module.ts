/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasAssessmentSubCriteriaPossibleScoreRoutingModule } from "./cas-assessment-sub-criteria-possible_score-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasAssessmentSubCriteriaPossibleScoreComponent } from "./cas-assessment-sub-criteria-possible_score.component";
import { CasAssessmentSubCriteriaPossibleScoreUpdateComponent } from "./update/cas-assessment-sub-criteria-possible_score-update.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CasAssessmentSubCriteriaPossibleScoreRoutingModule,
  ],
  declarations: [
    CasAssessmentSubCriteriaPossibleScoreComponent,
    CasAssessmentSubCriteriaPossibleScoreUpdateComponent,
  ],
  entryComponents: [CasAssessmentSubCriteriaPossibleScoreUpdateComponent],
})
export class CasAssessmentSubCriteriaPossibleScoreModule {}
