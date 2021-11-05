/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ProjectOutputRoutingModule} from "./project-output-routing.module";

import {SharedModule} from "../../shared/shared.module";
import {ProjectOutputComponent} from "./project-output.component";
import {ProjectOutputUpdateComponent} from "./update/project-output-update.component";
import {UploadComponent} from "./upload/upload.component";

@NgModule({
  imports: [SharedModule, CommonModule, ProjectOutputRoutingModule],
  declarations: [ProjectOutputComponent, ProjectOutputUpdateComponent, UploadComponent],
  entryComponents: [ProjectOutputUpdateComponent, UploadComponent],
})
export class ProjectOutputModule {
}
