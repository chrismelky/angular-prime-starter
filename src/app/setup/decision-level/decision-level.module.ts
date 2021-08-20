import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DecisionLevelRoutingModule} from "./decision-level-routing.module";

import {SharedModule} from "../../shared/shared.module";
import {DecisionLevelComponent} from "./decision-level.component";
import {DecisionLevelUpdateComponent} from "./update/decision-level-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, DecisionLevelRoutingModule],
  declarations: [DecisionLevelComponent, DecisionLevelUpdateComponent],
  entryComponents: [DecisionLevelUpdateComponent],
})
export class DecisionLevelModule {
}
