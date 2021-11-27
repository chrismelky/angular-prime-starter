/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../../shared/shared.module";
import { FacilityBankAccountComponent } from "./facility-bank-account.component";
import { FacilityBankAccountUpdateComponent } from "./update/facility-bank-account-update.component";

@NgModule({
  imports: [SharedModule, CommonModule],
  declarations: [
    FacilityBankAccountComponent,
    FacilityBankAccountUpdateComponent,
  ],
  entryComponents: [FacilityBankAccountComponent, FacilityBankAccountUpdateComponent],
})
export class FacilityBankAccountModule {}
