/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataElementGroupRoutingModule } from "./data-element-group-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { DataElementGroupComponent } from "./data-element-group.component";
import { DataElementGroupUpdateComponent } from "./update/data-element-group-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, DataElementGroupRoutingModule],
  declarations: [DataElementGroupComponent, DataElementGroupUpdateComponent],
  entryComponents: [DataElementGroupUpdateComponent],
})
export class DataElementGroupModule {}
