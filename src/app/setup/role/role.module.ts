/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RoleRoutingModule} from "./role-routing.module";

import {SharedModule} from "../../shared/shared.module";
import {RoleComponent} from "./role.component";
import {RoleUpdateComponent} from "./update/role-update.component";
import {RolePermissionModule} from "./role-permission/role-permission.module";

@NgModule({
  imports: [SharedModule, CommonModule, RoleRoutingModule, RolePermissionModule],
  declarations: [RoleComponent, RoleUpdateComponent],
  entryComponents: [RoleUpdateComponent],
})
export class RoleModule {
}
