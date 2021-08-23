/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasAssessmentCategoryRoutingModule } from "./cas-assessment-category-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasAssessmentCategoryComponent } from "./cas-assessment-category.component";
import { CasAssessmentCategoryUpdateComponent } from "./update/cas-assessment-category-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CasAssessmentCategoryRoutingModule],
  declarations: [
    CasAssessmentCategoryComponent,
    CasAssessmentCategoryUpdateComponent,
  ],
  entryComponents: [CasAssessmentCategoryUpdateComponent],
})
export class CasAssessmentCategoryModule {}
