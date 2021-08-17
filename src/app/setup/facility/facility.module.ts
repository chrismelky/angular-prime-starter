import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FacilityRoutingModule } from "./facility-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { FacilityComponent } from "./facility.component";
import { FacilityUpdateComponent } from "./update/facility-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, FacilityRoutingModule],
  declarations: [FacilityComponent, FacilityUpdateComponent],
  entryComponents: [FacilityUpdateComponent],
})
export class FacilityModule {}
