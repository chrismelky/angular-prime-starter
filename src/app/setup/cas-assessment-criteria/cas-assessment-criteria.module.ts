/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasAssessmentCriteriaRoutingModule } from "./cas-assessment-criteria-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasAssessmentCriteriaComponent } from "./cas-assessment-criteria.component";
import { CasAssessmentCriteriaUpdateComponent } from "./update/cas-assessment-criteria-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CasAssessmentCriteriaRoutingModule],
  declarations: [
    CasAssessmentCriteriaComponent,
    CasAssessmentCriteriaUpdateComponent,
  ],
  entryComponents: [CasAssessmentCriteriaUpdateComponent],
})
export class CasAssessmentCriteriaModule {}
