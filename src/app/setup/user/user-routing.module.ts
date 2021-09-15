/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UserComponent} from "./user.component";
import {UserUpdateComponent} from "./update/user-update.component";

const routes: Routes = [
  {
    path: "",
    component: UserComponent,
    data: {
      defaultSort: "id:asc",
    },
  },
  {
    path: "create",
    component: UserUpdateComponent,
  },
  {
    path: "edit/:id",
    component: UserUpdateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {
}
