import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SectorRoutingModule } from "./sector-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { SectorComponent } from "./sector.component";
import { SectorUpdateComponent } from "./update/sector-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, SectorRoutingModule],
  declarations: [SectorComponent, SectorUpdateComponent],
  entryComponents: [SectorUpdateComponent],
})
export class SectorModule {}
