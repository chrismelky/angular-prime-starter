/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReceivedAssessmentRoutingModule } from "./received-assessment-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ReceivedAssessmentComponent } from "./received-assessment.component";
import { ReceivedAssessmentUpdateComponent } from "./update/received-assessment-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ReceivedAssessmentRoutingModule],
  declarations: [
    ReceivedAssessmentComponent,
    ReceivedAssessmentUpdateComponent,
  ],
  entryComponents: [ReceivedAssessmentUpdateComponent],
})
export class ReceivedAssessmentModule {}
