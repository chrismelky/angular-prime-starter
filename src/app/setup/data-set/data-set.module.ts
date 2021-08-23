/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataSetRoutingModule } from "./data-set-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { DataSetComponent } from "./data-set.component";
import { DataSetUpdateComponent } from "./update/data-set-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, DataSetRoutingModule],
  declarations: [DataSetComponent, DataSetUpdateComponent],
  entryComponents: [DataSetUpdateComponent],
})
export class DataSetModule {}
