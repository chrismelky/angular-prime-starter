/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminHierarchyRoutingModule } from "./admin-hierarchy-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AdminHierarchyComponent } from "./admin-hierarchy.component";
import { AdminHierarchyUpdateComponent } from "./update/admin-hierarchy-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, AdminHierarchyRoutingModule],
  declarations: [AdminHierarchyComponent, AdminHierarchyUpdateComponent],
  entryComponents: [AdminHierarchyUpdateComponent],
})
export class AdminHierarchyModule {}
