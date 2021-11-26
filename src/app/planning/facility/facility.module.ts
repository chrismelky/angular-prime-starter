/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FacilityRoutingModule} from "./facility-routing.module";

import {SharedModule} from "../../shared/shared.module";
import {FacilityComponent} from "./facility.component";
import {FacilityCustomDetailValueModule} from "./facility-custom-detail-value/facility-custom-detail-value.module";
import {FacilityBankAccountModule} from "./facility-bank-account/facility-bank-account.module";

@NgModule({
  imports: [SharedModule, CommonModule, FacilityRoutingModule, FacilityCustomDetailValueModule, FacilityBankAccountModule],
  declarations: [FacilityComponent],
  entryComponents: [],
})
export class FacilityModule {
}
