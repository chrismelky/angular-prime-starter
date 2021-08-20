/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminHierarchyLevelRoutingModule } from "./admin-hierarchy-level-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AdminHierarchyLevelComponent } from "./admin-hierarchy-level.component";
import { AdminHierarchyLevelUpdateComponent } from "./update/admin-hierarchy-level-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, AdminHierarchyLevelRoutingModule],
  declarations: [
    AdminHierarchyLevelComponent,
    AdminHierarchyLevelUpdateComponent,
  ],
  entryComponents: [AdminHierarchyLevelUpdateComponent],
})
export class AdminHierarchyLevelModule {}
