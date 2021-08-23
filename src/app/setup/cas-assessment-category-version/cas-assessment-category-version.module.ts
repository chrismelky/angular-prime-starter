/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasAssessmentCategoryVersionRoutingModule } from "./cas-assessment-category-version-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasAssessmentCategoryVersionComponent } from "./cas-assessment-category-version.component";
import { CasAssessmentCategoryVersionUpdateComponent } from "./update/cas-assessment-category-version-update.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CasAssessmentCategoryVersionRoutingModule,
  ],
  declarations: [
    CasAssessmentCategoryVersionComponent,
    CasAssessmentCategoryVersionUpdateComponent,
  ],
  entryComponents: [CasAssessmentCategoryVersionUpdateComponent],
})
export class CasAssessmentCategoryVersionModule {}
