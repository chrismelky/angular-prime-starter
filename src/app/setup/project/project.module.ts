/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ProjectRoutingModule} from "./project-routing.module";

import {SharedModule} from "../../shared/shared.module";
import {ProjectComponent} from "./project.component";
import {ProjectUpdateComponent} from "./update/project-update.component";
import {ProjectSectorModule} from "./project-sector/project-sector.module";
import {ProjectFundSourceModule} from "./project-fund-source/project-fund-source.module";

@NgModule({
  imports: [SharedModule, CommonModule, ProjectRoutingModule, ProjectFundSourceModule, ProjectSectorModule],
  declarations: [ProjectComponent, ProjectUpdateComponent],
  entryComponents: [ProjectUpdateComponent],
})
export class ProjectModule {
}
