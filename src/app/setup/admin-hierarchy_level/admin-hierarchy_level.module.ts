import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminHierarchyLevelRoutingModule } from "./admin-hierarchy_level-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AdminHierarchyLevelComponent } from "./admin-hierarchy_level.component";
import { AdminHierarchyLevelUpdateComponent } from "./update/admin-hierarchy_level-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, AdminHierarchyLevelRoutingModule],
  declarations: [
    AdminHierarchyLevelComponent,
    AdminHierarchyLevelUpdateComponent,
  ],
  entryComponents: [AdminHierarchyLevelUpdateComponent],
})
export class AdminHierarchyLevelModule {}
