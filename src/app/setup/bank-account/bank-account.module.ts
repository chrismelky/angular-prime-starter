/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BankAccountRoutingModule } from "./bank-account-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { BankAccountComponent } from "./bank-account.component";
import { BankAccountUpdateComponent } from "./update/bank-account-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, BankAccountRoutingModule],
  declarations: [BankAccountComponent, BankAccountUpdateComponent],
  entryComponents: [BankAccountUpdateComponent],
})
export class BankAccountModule {}
