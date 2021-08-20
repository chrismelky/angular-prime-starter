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
      {
        path: "decision-level",
        loadChildren: () =>
          import("../setup/decision-level/decision-level.module").then(
            (m) => m.DecisionLevelModule
          ),
      },
      {
        path: "reference-document_type",
        loadChildren: () =>
          import(
            "../setup/reference-document_type/reference-document_type.module"
          ).then((m) => m.ReferenceDocumentTypeModule),
      },
      {
        path: "reference-type",
        loadChildren: () =>
          import("../setup/reference-type/reference-type.module").then(
            (m) => m.ReferenceTypeModule
          ),
      },
      {
        path: "financial-year",
        loadChildren: () =>
          import("../setup/financial-year/financial-year.module").then(
            (m) => m.FinancialYearModule
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
