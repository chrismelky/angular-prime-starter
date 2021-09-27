/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AssessmentHomeComponent } from "./assessment-home.component";
import {AssessmentCriteriaComponent} from "../../planning/assessment-criteria/assessment-criteria.component";
import {MyAssessmentComponent} from "../../planning/my-assessment/my-assessment.component";
import {ReceivedAssessmentComponent} from "../../planning/received-assessment/received-assessment.component";

const routes: Routes = [
  {
    path: "",
    component: AssessmentHomeComponent,
    data: {
      defaultSort: "id:asc",
    },
    //canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/assessment-criteria/:round_id/:fy_id",
    component: AssessmentCriteriaComponent,
    data: {
      defaultSort: "id:asc",
    },
    //canActivate: [UserRouteAccessService],
  },{
    path: ":id/my-assessments/:round_id/:fy_id",
    component: MyAssessmentComponent,
    data: {
      defaultSort: "id:asc",
    },
    //canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/received-assessments/:round_id/:fy_id",
    component: ReceivedAssessmentComponent,
    data: {
      defaultSort: "id:asc",
    },
    //canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentHomeRoutingModule {}
