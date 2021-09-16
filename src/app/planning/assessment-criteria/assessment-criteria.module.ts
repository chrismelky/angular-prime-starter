/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssessmentCriteriaRoutingModule } from "./assessment-criteria-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AssessmentCriteriaComponent } from "./assessment-criteria.component";
import { AssessmentCriteriaUpdateComponent } from "./update/assessment-criteria-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, AssessmentCriteriaRoutingModule],
  declarations: [
    AssessmentCriteriaComponent,
    AssessmentCriteriaUpdateComponent,
  ],
  entryComponents: [AssessmentCriteriaUpdateComponent],
})
export class AssessmentCriteriaModule {}
