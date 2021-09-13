/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MyAssessmentRoutingModule } from "./my-assessment-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { MyAssessmentComponent } from "./my-assessment.component";
import { MyAssessmentUpdateComponent } from "./update/my-assessment-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, MyAssessmentRoutingModule],
  declarations: [MyAssessmentComponent, MyAssessmentUpdateComponent],
  entryComponents: [MyAssessmentUpdateComponent],
})
export class MyAssessmentModule {}
