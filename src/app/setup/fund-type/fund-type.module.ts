/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FundTypeRoutingModule } from "./fund-type-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { FundTypeComponent } from "./fund-type.component";
import { FundTypeUpdateComponent } from "./update/fund-type-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, FundTypeRoutingModule],
  declarations: [FundTypeComponent, FundTypeUpdateComponent],
  entryComponents: [FundTypeUpdateComponent],
})
export class FundTypeModule {}
