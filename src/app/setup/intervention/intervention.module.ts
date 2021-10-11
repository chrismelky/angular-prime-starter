/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InterventionRoutingModule } from "./intervention-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { InterventionComponent } from "./intervention.component";
import { InterventionUpdateComponent } from "./update/intervention-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, InterventionRoutingModule],
  declarations: [InterventionComponent, InterventionUpdateComponent],
  entryComponents: [InterventionUpdateComponent],
})
export class InterventionModule {}
