/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ObjectiveTypeRoutingModule } from "./objective-type-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ObjectiveTypeComponent } from "./objective-type.component";
import { ObjectiveTypeUpdateComponent } from "./update/objective-type-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ObjectiveTypeRoutingModule],
  declarations: [ObjectiveTypeComponent, ObjectiveTypeUpdateComponent],
  entryComponents: [ObjectiveTypeUpdateComponent],
})
export class ObjectiveTypeModule {}
