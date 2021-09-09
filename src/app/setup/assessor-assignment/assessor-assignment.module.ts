/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssessorAssignmentRoutingModule } from "./assessor-assignment-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AssessorAssignmentComponent } from "./assessor-assignment.component";
import { AssessorAssignmentUpdateComponent } from "./update/assessor-assignment-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, AssessorAssignmentRoutingModule],
  declarations: [
    AssessorAssignmentComponent,
    AssessorAssignmentUpdateComponent,
  ],
  entryComponents: [AssessorAssignmentUpdateComponent],
})
export class AssessorAssignmentModule {}
