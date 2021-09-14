/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../shared/shared.module";
import {RolePermissionComponent} from "./role-permission.component";
import {RolePermissionUpdateComponent} from "./update/role-permission-update.component";
import {CreateComponent} from "./create/create.component";

@NgModule({
  imports: [SharedModule, CommonModule],
  declarations: [RolePermissionComponent, CreateComponent,RolePermissionUpdateComponent],
  entryComponents: [RolePermissionUpdateComponent],
})
export class RolePermissionModule {
}
