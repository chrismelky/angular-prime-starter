import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SectorComponent } from "./sector.component";

const routes: Routes = [
  {
    path: "",
    component: SectorComponent,
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
export class SectorRoutingModule {}
