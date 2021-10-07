/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectSectorRoutingModule } from "./project-sector-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ProjectSectorComponent } from "./project-sector.component";
import { ProjectSectorUpdateComponent } from "./update/project-sector-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ProjectSectorRoutingModule],
  declarations: [ProjectSectorComponent, ProjectSectorUpdateComponent],
  entryComponents: [ProjectSectorUpdateComponent],
})
export class ProjectSectorModule {}
