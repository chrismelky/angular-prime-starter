/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountTypeRoutingModule } from "./account-type-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AccountTypeComponent } from "./account-type.component";
import { AccountTypeUpdateComponent } from "./update/account-type-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, AccountTypeRoutingModule],
  declarations: [AccountTypeComponent, AccountTypeUpdateComponent],
  entryComponents: [AccountTypeUpdateComponent],
})
export class AccountTypeModule {}
