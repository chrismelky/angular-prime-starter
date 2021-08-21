/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ObjectiveRoutingModule } from "./objective-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ObjectiveComponent } from "./objective.component";
import { ObjectiveUpdateComponent } from "./update/objective-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ObjectiveRoutingModule],
  declarations: [ObjectiveComponent, ObjectiveUpdateComponent],
  entryComponents: [ObjectiveUpdateComponent],
})
export class ObjectiveModule {}
