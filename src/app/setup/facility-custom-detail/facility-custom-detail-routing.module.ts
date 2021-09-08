/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FacilityCustomDetailComponent } from "./facility-custom-detail.component";

const routes: Routes = [
  {
    path: "",
    component: FacilityCustomDetailComponent,
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
export class FacilityCustomDetailRoutingModule {}
