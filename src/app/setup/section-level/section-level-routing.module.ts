import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SectionLevelComponent } from "./section-level.component";

const routes: Routes = [
  {
    path: "",
    component: SectionLevelComponent,
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
export class SectionLevelRoutingModule {}
