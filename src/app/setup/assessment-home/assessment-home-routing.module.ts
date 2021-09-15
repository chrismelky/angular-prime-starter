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
    path: ":id/assessment-criteria",
    component: AssessmentCriteriaComponent,
    data: {
      defaultSort: "id:asc",
    },
    //canActivate: [UserRouteAccessService],
  },{
    path: ":id/my-assessments",
    component: AssessmentCriteriaComponent,
    data: {
      defaultSort: "id:asc",
    },
    //canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/received-assessments",
    component: AssessmentCriteriaComponent,
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
