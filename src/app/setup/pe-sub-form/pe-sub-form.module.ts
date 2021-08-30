/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PeSubFormRoutingModule } from "./pe-sub-form-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { PeSubFormComponent } from "./pe-sub-form.component";
import { PeSubFormUpdateComponent } from "./update/pe-sub-form-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, PeSubFormRoutingModule],
  declarations: [PeSubFormComponent, PeSubFormUpdateComponent],
  entryComponents: [PeSubFormUpdateComponent],
})
export class PeSubFormModule {}
