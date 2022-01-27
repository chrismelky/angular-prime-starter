/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectDataFormRoutingModule } from "./project-data-form-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ProjectDataFormComponent } from "./project-data-form.component";
import { ProjectDataFormUpdateComponent } from "./update/project-data-form-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ProjectDataFormRoutingModule],
  declarations: [ProjectDataFormComponent, ProjectDataFormUpdateComponent],
  entryComponents: [ProjectDataFormUpdateComponent],
})
export class ProjectDataFormModule {}
