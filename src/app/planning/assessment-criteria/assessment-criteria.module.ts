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
import {SetScoresComponent} from "./update/set-scores.component";
import {SetCommentComponent} from "./update/set-comment.component";

@NgModule({
  imports: [SharedModule, CommonModule, AssessmentCriteriaRoutingModule],
  declarations: [
    AssessmentCriteriaComponent,
    AssessmentCriteriaUpdateComponent,SetScoresComponent,SetCommentComponent
  ],
  entryComponents: [AssessmentCriteriaUpdateComponent,SetScoresComponent,SetCommentComponent],
})
export class AssessmentCriteriaModule {}
