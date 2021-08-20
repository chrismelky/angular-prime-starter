import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "",
        redirectTo: "/dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("../dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "admin-hierarchy_level",
        loadChildren: () =>
          import(
            "../setup/admin-hierarchy_level/admin-hierarchy_level.module"
          ).then((m) => m.AdminHierarchyLevelModule),
      },
      {
        path: "sector",
        loadChildren: () =>
          import("../setup/sector/sector.module").then((m) => m.SectorModule),
      },
      {
        path: "section-level",
        loadChildren: () =>
          import("../setup/section-level/section-level.module").then(
            (m) => m.SectionLevelModule
          ),
      },
      {
        path: "section",
        loadChildren: () =>
          import("../setup/section/section.module").then(
            (m) => m.SectionModule
          ),
      },
      /**====Planrep router Generator Hook: Dont Delete====*/
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
