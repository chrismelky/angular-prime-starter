/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BudgetClassRoutingModule } from "./budget-class-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { BudgetClassComponent } from "./budget-class.component";
import { BudgetClassUpdateComponent } from "./update/budget-class-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, BudgetClassRoutingModule],
  declarations: [BudgetClassComponent, BudgetClassUpdateComponent],
  entryComponents: [BudgetClassUpdateComponent],
})
export class BudgetClassModule {}
