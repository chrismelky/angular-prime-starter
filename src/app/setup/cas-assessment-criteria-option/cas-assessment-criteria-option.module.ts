/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasAssessmentCriteriaOptionRoutingModule } from "./cas-assessment-criteria-option-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasAssessmentCriteriaOptionComponent } from "./cas-assessment-criteria-option.component";
import { CasAssessmentCriteriaOptionUpdateComponent } from "./update/cas-assessment-criteria-option-update.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CasAssessmentCriteriaOptionRoutingModule,
  ],
  declarations: [
    CasAssessmentCriteriaOptionComponent,
    CasAssessmentCriteriaOptionUpdateComponent,
  ],
  entryComponents: [CasAssessmentCriteriaOptionUpdateComponent],
})
export class CasAssessmentCriteriaOptionModule {}
