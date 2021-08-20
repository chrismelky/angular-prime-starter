/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReferenceTypeRoutingModule } from "./reference-type-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ReferenceTypeComponent } from "./reference-type.component";
import { ReferenceTypeUpdateComponent } from "./update/reference-type-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ReferenceTypeRoutingModule],
  declarations: [ReferenceTypeComponent, ReferenceTypeUpdateComponent],
  entryComponents: [ReferenceTypeUpdateComponent],
})
export class ReferenceTypeModule {}
