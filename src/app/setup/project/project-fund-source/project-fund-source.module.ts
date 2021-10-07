/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProjectFundSourceComponent } from "./project-fund-source.component";
import { ProjectFundSourceUpdateComponent } from "./update/project-fund-source-update.component";
import {CreateComponent} from "./create/create.component";
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
  imports: [SharedModule, CommonModule],
  declarations: [ProjectFundSourceComponent, ProjectFundSourceUpdateComponent, CreateComponent],
  entryComponents: [ProjectFundSourceUpdateComponent],
})
export class ProjectFundSourceModule {}
