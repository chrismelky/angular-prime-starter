/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectFundSourceRoutingModule } from "./project-fund-source-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ProjectFundSourceComponent } from "./project-fund-source.component";
import { ProjectFundSourceUpdateComponent } from "./update/project-fund-source-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ProjectFundSourceRoutingModule],
  declarations: [ProjectFundSourceComponent, ProjectFundSourceUpdateComponent],
  entryComponents: [ProjectFundSourceUpdateComponent],
})
export class ProjectFundSourceModule {}
