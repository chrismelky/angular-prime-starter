/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenericPriorityRoutingModule } from "./generic-priority-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { GenericPriorityComponent } from "./generic-priority.component";
import { GenericPriorityUpdateComponent } from "./update/generic-priority-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, GenericPriorityRoutingModule],
  declarations: [GenericPriorityComponent, GenericPriorityUpdateComponent],
  entryComponents: [GenericPriorityUpdateComponent],
})
export class GenericPriorityModule {}
