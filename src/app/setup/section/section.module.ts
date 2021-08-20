import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SectionRoutingModule } from "./section-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { SectionComponent } from "./section.component";
import { SectionUpdateComponent } from "./update/section-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, SectionRoutingModule],
  declarations: [SectionComponent, SectionUpdateComponent],
  entryComponents: [SectionUpdateComponent],
})
export class SectionModule {}
