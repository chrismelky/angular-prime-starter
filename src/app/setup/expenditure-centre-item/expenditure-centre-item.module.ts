/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpenditureCentreItemRoutingModule } from "./expenditure-centre-item-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ExpenditureCentreItemComponent } from "./expenditure-centre-item.component";
import { ExpenditureCentreItemUpdateComponent } from "./update/expenditure-centre-item-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ExpenditureCentreItemRoutingModule],
  declarations: [
    ExpenditureCentreItemComponent,
    ExpenditureCentreItemUpdateComponent,
  ],
  entryComponents: [ExpenditureCentreItemUpdateComponent],
})
export class ExpenditureCentreItemModule {}
