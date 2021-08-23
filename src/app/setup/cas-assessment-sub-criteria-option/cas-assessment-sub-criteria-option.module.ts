/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasAssessmentSubCriteriaOptionRoutingModule } from "./cas-assessment-sub-criteria-option-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasAssessmentSubCriteriaOptionComponent } from "./cas-assessment-sub-criteria-option.component";
import { CasAssessmentSubCriteriaOptionUpdateComponent } from "./update/cas-assessment-sub-criteria-option-update.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CasAssessmentSubCriteriaOptionRoutingModule,
  ],
  declarations: [
    CasAssessmentSubCriteriaOptionComponent,
    CasAssessmentSubCriteriaOptionUpdateComponent,
  ],
  entryComponents: [CasAssessmentSubCriteriaOptionUpdateComponent],
})
export class CasAssessmentSubCriteriaOptionModule {}
