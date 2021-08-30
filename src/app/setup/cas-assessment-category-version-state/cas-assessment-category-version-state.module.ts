/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasAssessmentCategoryVersionStateRoutingModule } from "./cas-assessment-category-version-state-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasAssessmentCategoryVersionStateComponent } from "./cas-assessment-category-version-state.component";
import { CasAssessmentCategoryVersionStateUpdateComponent } from "./update/cas-assessment-category-version-state-update.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CasAssessmentCategoryVersionStateRoutingModule,
  ],
  declarations: [
    CasAssessmentCategoryVersionStateComponent,
    CasAssessmentCategoryVersionStateUpdateComponent,
  ],
  entryComponents: [CasAssessmentCategoryVersionStateUpdateComponent],
})
export class CasAssessmentCategoryVersionStateModule {}
