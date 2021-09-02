/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataValueRoutingModule } from "./data-value-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { DataValueComponent } from "./data-value.component";
import { DataValueUpdateComponent } from "./update/data-value-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, DataValueRoutingModule],
  declarations: [DataValueComponent, DataValueUpdateComponent],
  entryComponents: [DataValueUpdateComponent],
})
export class DataValueModule {}
