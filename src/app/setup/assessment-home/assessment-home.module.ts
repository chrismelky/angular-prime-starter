/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssessmentHomeRoutingModule } from "./assessment-home-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AssessmentHomeComponent } from "./assessment-home.component";
import { AssessmentHomeUpdateComponent } from "./update/assessment-home-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, AssessmentHomeRoutingModule],
  declarations: [AssessmentHomeComponent, AssessmentHomeUpdateComponent],
  entryComponents: [AssessmentHomeUpdateComponent],
})
export class AssessmentHomeModule {}
