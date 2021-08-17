import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FacilityComponent } from "./facility.component";

const routes: Routes = [
  {
    path: "",
    component: FacilityComponent,
    data: {
      defaultSort: "id,asc",
    },
    //canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityRoutingModule {}
