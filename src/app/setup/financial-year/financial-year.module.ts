/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FinancialYearRoutingModule } from "./financial-year-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { FinancialYearComponent } from "./financial-year.component";
import { FinancialYearUpdateComponent } from "./update/financial-year-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, FinancialYearRoutingModule],
  declarations: [FinancialYearComponent, FinancialYearUpdateComponent],
  entryComponents: [FinancialYearUpdateComponent],
})
export class FinancialYearModule {}
