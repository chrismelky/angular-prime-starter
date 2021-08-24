/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LongTermTargetRoutingModule } from "./long-term-target-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { LongTermTargetComponent } from "./long-term-target.component";
import { LongTermTargetUpdateComponent } from "./update/long-term-target-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, LongTermTargetRoutingModule],
  declarations: [LongTermTargetComponent, LongTermTargetUpdateComponent],
  entryComponents: [LongTermTargetUpdateComponent],
})
export class LongTermTargetModule {}