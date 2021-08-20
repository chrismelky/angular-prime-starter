import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminHierarchyLevelComponent } from "./admin-hierarchy_level.component";

const routes: Routes = [
  {
    path: "",
    component: AdminHierarchyLevelComponent,
    data: {
      defaultSort: "id:asc",
    },
    //canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminHierarchyLevelRoutingModule {}
