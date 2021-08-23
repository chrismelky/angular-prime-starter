/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasAssessmentSubCriteriaRoutingModule } from "./cas-assessment-sub-criteria-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasAssessmentSubCriteriaComponent } from "./cas-assessment-sub-criteria.component";
import { CasAssessmentSubCriteriaUpdateComponent } from "./update/cas-assessment-sub-criteria-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CasAssessmentSubCriteriaRoutingModule],
  declarations: [
    CasAssessmentSubCriteriaComponent,
    CasAssessmentSubCriteriaUpdateComponent,
  ],
  entryComponents: [CasAssessmentSubCriteriaUpdateComponent],
})
export class CasAssessmentSubCriteriaModule {}
