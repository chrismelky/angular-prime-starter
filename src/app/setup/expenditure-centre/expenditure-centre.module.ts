/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpenditureCentreRoutingModule } from "./expenditure-centre-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ExpenditureCentreComponent } from "./expenditure-centre.component";
import { ExpenditureCentreUpdateComponent } from "./update/expenditure-centre-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ExpenditureCentreRoutingModule],
  declarations: [ExpenditureCentreComponent, ExpenditureCentreUpdateComponent],
  entryComponents: [ExpenditureCentreUpdateComponent],
})
export class ExpenditureCentreModule {}
