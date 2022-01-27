/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectDataFormItemRoutingModule } from "./project-data-form-item-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ProjectDataFormItemComponent } from "./project-data-form-item.component";
import { ProjectDataFormItemUpdateComponent } from "./update/project-data-form-item-update.component";
import {ToolbarModule} from 'primeng/toolbar';

@NgModule({
  imports: [SharedModule, CommonModule, ProjectDataFormItemRoutingModule,ToolbarModule],
  declarations: [
    ProjectDataFormItemComponent,
    ProjectDataFormItemUpdateComponent,
  ],
  entryComponents: [ProjectDataFormItemUpdateComponent],
})
export class ProjectDataFormItemModule {}
