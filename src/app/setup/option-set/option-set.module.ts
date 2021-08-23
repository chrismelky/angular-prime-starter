/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OptionSetRoutingModule } from "./option-set-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { OptionSetComponent } from "./option-set.component";
import { OptionSetUpdateComponent } from "./update/option-set-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, OptionSetRoutingModule],
  declarations: [OptionSetComponent, OptionSetUpdateComponent],
  entryComponents: [OptionSetUpdateComponent],
})
export class OptionSetModule {}
