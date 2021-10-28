/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectionRoutingModule } from "./projection-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ProjectionComponent } from "./projection.component";
import { ProjectionUpdateComponent } from "./update/projection-update.component";
import {SplitButtonModule} from "primeng/splitbutton";
import { InitiateProjectionComponent } from './initiate-projection/initiate-projection.component';

@NgModule({
    imports: [SharedModule, CommonModule, ProjectionRoutingModule, SplitButtonModule],
  declarations: [ProjectionComponent, ProjectionUpdateComponent, InitiateProjectionComponent],
  entryComponents: [ProjectionUpdateComponent],
})
export class ProjectionModule {}
