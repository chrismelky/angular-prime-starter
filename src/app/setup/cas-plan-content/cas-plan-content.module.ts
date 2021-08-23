/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CasPlanContentRoutingModule } from "./cas-plan-content-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CasPlanContentComponent } from "./cas-plan-content.component";
import { CasPlanContentUpdateComponent } from "./update/cas-plan-content-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CasPlanContentRoutingModule],
  declarations: [CasPlanContentComponent, CasPlanContentUpdateComponent],
  entryComponents: [CasPlanContentUpdateComponent],
})
export class CasPlanContentModule {}
