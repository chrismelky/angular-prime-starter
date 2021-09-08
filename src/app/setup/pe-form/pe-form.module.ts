/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PeFormRoutingModule } from "./pe-form-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { PeFormComponent } from "./pe-form.component";
import { PeFormUpdateComponent } from "./update/pe-form-update.component";
import {PeViewDetailsComponent} from "./update/pe-view-details.component";

@NgModule({
  imports: [SharedModule, CommonModule, PeFormRoutingModule],
  declarations: [PeFormComponent, PeFormUpdateComponent,PeViewDetailsComponent],
  entryComponents: [PeFormUpdateComponent,PeViewDetailsComponent],
})
export class PeFormModule {}
