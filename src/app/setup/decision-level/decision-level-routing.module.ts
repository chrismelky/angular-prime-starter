import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DecisionLevelComponent } from "./decision-level.component";

const routes: Routes = [
  {
    path: "",
    component: DecisionLevelComponent,
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
export class DecisionLevelRoutingModule {}
