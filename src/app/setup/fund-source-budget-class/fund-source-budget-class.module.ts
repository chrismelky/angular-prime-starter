/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FundSourceBudgetClassRoutingModule } from "./fund-source-budget-class-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { FundSourceBudgetClassComponent } from "./fund-source-budget-class.component";
import { FundSourceBudgetClassUpdateComponent } from "./update/fund-source-budget-class-update.component";
import { CeiningsSectorComponent } from './update/ceinings-sector.component';
import { CeilingFacilityTypeComponent } from './update/ceiling-facility-type.component';

@NgModule({
  imports: [SharedModule, CommonModule, FundSourceBudgetClassRoutingModule],
  declarations: [
    FundSourceBudgetClassComponent,
    FundSourceBudgetClassUpdateComponent,
    CeiningsSectorComponent,
    CeilingFacilityTypeComponent,
  ],
  entryComponents: [FundSourceBudgetClassUpdateComponent],
})
export class FundSourceBudgetClassModule {}
