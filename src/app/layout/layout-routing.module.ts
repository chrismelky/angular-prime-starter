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
        path: "asset-use",
        loadChildren: () =>
          import("../setup/asset-use/asset-use.module").then(
            (m) => m.AssetUseModule
          ),
      },
      {
        path: "bank-account",
        loadChildren: () =>
          import("../setup/bank-account/bank-account.module").then(
            (m) => m.BankAccountModule
          ),
      },
      {
        path: "asset-condition",
        loadChildren: () =>
          import("../setup/asset-condition/asset-condition.module").then(
            (m) => m.AssetConditionModule
          ),
      },
      {
        path: "account-type",
        loadChildren: () =>
          import("../setup/account-type/account-type.module").then(
            (m) => m.AccountTypeModule
          ),
      },
      {
        path: "activity-type",
        loadChildren: () =>
          import("../setup/activity-type/activity-type.module").then(
            (m) => m.ActivityTypeModule
          ),
      },
      {
        path: "activity-task_nature",
        loadChildren: () =>
          import(
            "../setup/activity-task_nature/activity-task_nature.module"
          ).then((m) => m.ActivityTaskNatureModule),
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
