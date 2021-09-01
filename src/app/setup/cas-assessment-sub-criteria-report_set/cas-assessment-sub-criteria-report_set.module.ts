/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasAssessmentSubCriteriaReportSetRoutingModule } from "./cas-assessment-sub-criteria-report_set-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasAssessmentSubCriteriaReportSetComponent } from "./cas-assessment-sub-criteria-report_set.component";
import { CasAssessmentSubCriteriaReportSetUpdateComponent } from "./update/cas-assessment-sub-criteria-report_set-update.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CasAssessmentSubCriteriaReportSetRoutingModule,
  ],
  declarations: [
    CasAssessmentSubCriteriaReportSetComponent,
    CasAssessmentSubCriteriaReportSetUpdateComponent,
  ],
  entryComponents: [CasAssessmentSubCriteriaReportSetUpdateComponent],
})
export class CasAssessmentSubCriteriaReportSetModule {}
