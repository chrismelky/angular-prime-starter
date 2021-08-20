import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SectionLevelRoutingModule } from "./section-level-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { SectionLevelComponent } from "./section-level.component";
import { SectionLevelUpdateComponent } from "./update/section-level-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, SectionLevelRoutingModule],
  declarations: [SectionLevelComponent, SectionLevelUpdateComponent],
  entryComponents: [SectionLevelUpdateComponent],
})
export class SectionLevelModule {}
