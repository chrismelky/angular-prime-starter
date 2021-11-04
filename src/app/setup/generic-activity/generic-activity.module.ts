/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenericActivityRoutingModule } from "./generic-activity-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { GenericActivityComponent } from "./generic-activity.component";
import { GenericActivityUpdateComponent } from "./update/generic-activity-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, GenericActivityRoutingModule],
  declarations: [GenericActivityComponent, GenericActivityUpdateComponent],
  entryComponents: [GenericActivityUpdateComponent],
})
export class GenericActivityModule {}
