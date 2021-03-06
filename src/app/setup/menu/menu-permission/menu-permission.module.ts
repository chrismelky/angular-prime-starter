/**  * @license */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { MenuPermissionComponent } from './menu-permission.component';
import { MenuPermissionUpdateComponent } from './update/menu-permission-update.component';
import { CreateComponent } from './create/create.component';

@NgModule({
  imports: [SharedModule, CommonModule],
  declarations: [
    MenuPermissionComponent,
    MenuPermissionUpdateComponent,
    CreateComponent,
  ],
  entryComponents: [MenuPermissionUpdateComponent, CreateComponent],
})
export class MenuPermissionModule {}
