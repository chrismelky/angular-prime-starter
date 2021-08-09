import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityTypeRoutingModule } from './facility-type-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { FacilityTypeComponent } from './facility-type.component';
import { FacilityTypeUpdateComponent } from './update/facility-type-update.component';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  imports: [SharedModule, CommonModule, FacilityTypeRoutingModule],
  declarations: [FacilityTypeComponent, FacilityTypeUpdateComponent],
  entryComponents: [FacilityTypeUpdateComponent],
})
export class FacilityTypeModule {}
