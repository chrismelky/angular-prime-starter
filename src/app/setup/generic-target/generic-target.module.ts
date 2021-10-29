/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenericTargetRoutingModule } from "./generic-target-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { GenericTargetComponent } from "./generic-target.component";
import { GenericTargetUpdateComponent } from "./update/generic-target-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, GenericTargetRoutingModule],
  declarations: [GenericTargetComponent, GenericTargetUpdateComponent],
  entryComponents: [GenericTargetUpdateComponent],
})
export class GenericTargetModule {}
