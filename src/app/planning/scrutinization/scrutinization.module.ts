/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScrutinizationRoutingModule } from "./scrutinization-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ScrutinizationComponent } from "./scrutinization.component";
import { ScrutinizationUpdateComponent } from "./update/scrutinization-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ScrutinizationRoutingModule],
  declarations: [ScrutinizationComponent, ScrutinizationUpdateComponent],
  entryComponents: [ScrutinizationUpdateComponent],
})
export class ScrutinizationModule {}
