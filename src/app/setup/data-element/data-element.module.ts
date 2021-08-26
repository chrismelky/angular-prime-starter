/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataElementRoutingModule } from "./data-element-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { DataElementComponent } from "./data-element.component";
import { DataElementUpdateComponent } from "./update/data-element-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, DataElementRoutingModule],
  declarations: [DataElementComponent, DataElementUpdateComponent],
  entryComponents: [DataElementUpdateComponent],
})
export class DataElementModule {}
