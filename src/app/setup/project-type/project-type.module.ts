/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectTypeRoutingModule } from "./project-type-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ProjectTypeComponent } from "./project-type.component";
import { ProjectTypeUpdateComponent } from "./update/project-type-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ProjectTypeRoutingModule],
  declarations: [ProjectTypeComponent, ProjectTypeUpdateComponent],
  entryComponents: [ProjectTypeUpdateComponent],
})
export class ProjectTypeModule {}
