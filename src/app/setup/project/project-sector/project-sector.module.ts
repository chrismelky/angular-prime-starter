/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ProjectSectorComponent} from "./project-sector.component";
import {ProjectSectorUpdateComponent} from "./update/project-sector-update.component";
import {CreateComponent} from "./create/create.component";
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
  imports: [SharedModule, CommonModule],
  declarations: [ProjectSectorComponent, ProjectSectorUpdateComponent, CreateComponent],
  entryComponents: [ProjectSectorUpdateComponent],
})
export class ProjectSectorModule {
}
