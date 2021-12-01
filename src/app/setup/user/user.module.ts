/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {UserRoutingModule} from "./user-routing.module";

import {SharedModule} from "../../shared/shared.module";
import {UserComponent} from "./user.component";
import {UserUpdateComponent} from "./update/user-update.component";
import {UserRoleModule} from "./user-role/user-role.module";
import {UserGroupModule} from "./user-group/user-group.module";
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {TransferComponent} from "./transfer/transfer.component";

@NgModule({
  imports: [SharedModule, CommonModule, UserRoleModule, UserGroupModule, UserRoutingModule],
  declarations: [UserComponent, UserUpdateComponent, PasswordResetComponent, TransferComponent],
  entryComponents: [UserUpdateComponent],
})
export class UserModule {
}
