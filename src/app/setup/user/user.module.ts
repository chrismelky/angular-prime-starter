/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserRoutingModule } from "./user-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { UserComponent } from "./user.component";
import { UserUpdateComponent } from "./update/user-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, UserRoutingModule],
  declarations: [UserComponent, UserUpdateComponent],
  entryComponents: [UserUpdateComponent],
})
export class UserModule {}
