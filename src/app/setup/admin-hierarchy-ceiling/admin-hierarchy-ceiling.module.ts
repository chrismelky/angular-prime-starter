/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminHierarchyCeilingRoutingModule } from "./admin-hierarchy-ceiling-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AdminHierarchyCeilingComponent } from "./admin-hierarchy-ceiling.component";
import { AdminHierarchyCeilingUpdateComponent } from "./update/admin-hierarchy-ceiling-update.component";
import { InitiateCeilingComponent } from './update/initiate-ceiling.component';

@NgModule({
  imports: [SharedModule, CommonModule, AdminHierarchyCeilingRoutingModule],
  declarations: [
    AdminHierarchyCeilingComponent,
    AdminHierarchyCeilingUpdateComponent,
    InitiateCeilingComponent,
  ],
  entryComponents: [AdminHierarchyCeilingUpdateComponent],
})
export class AdminHierarchyCeilingModule {}