/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataElementGroupSetRoutingModule } from "./data-element-group-set-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { DataElementGroupSetComponent } from "./data-element-group-set.component";
import { DataElementGroupSetUpdateComponent } from "./update/data-element-group-set-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, DataElementGroupSetRoutingModule],
  declarations: [
    DataElementGroupSetComponent,
    DataElementGroupSetUpdateComponent,
  ],
  entryComponents: [DataElementGroupSetUpdateComponent],
})
export class DataElementGroupSetModule {}
