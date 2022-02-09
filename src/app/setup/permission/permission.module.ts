/**  * @license */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionRoutingModule } from './permission-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { PermissionComponent } from './permission.component';
import { PermissionUpdateComponent } from './update/permission-update.component';

@NgModule({
  imports: [SharedModule, CommonModule, PermissionRoutingModule],
  declarations: [PermissionComponent, PermissionUpdateComponent],
  entryComponents: [PermissionUpdateComponent],
})
export class PermissionModule {}
