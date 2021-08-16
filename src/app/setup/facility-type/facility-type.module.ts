import { NgModule } from '@angular/core';
import { FacilityTypeRoutingModule } from './facility-type-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { FacilityTypeComponent } from './facility-type.component';
import { FacilityTypeUpdateComponent } from './update/facility-type-update.component';

@NgModule({
  imports: [SharedModule, FacilityTypeRoutingModule],
  declarations: [FacilityTypeComponent, FacilityTypeUpdateComponent],
  entryComponents: [FacilityTypeUpdateComponent],
})
export class FacilityTypeModule {}
