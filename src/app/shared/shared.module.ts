import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedMaterialModule } from './shared-material.module';
import { SharedPrimengModule } from './shared-primeng.module';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminHierarchyTreeComponent } from '../shared/admin-hierarchy-tree/admin-hierarchy-tree.component';

@NgModule({
  declarations: [AdminHierarchyTreeComponent],
  imports: [SharedMaterialModule, SharedPrimengModule],
  exports: [
    SharedMaterialModule,
    SharedPrimengModule,
    AdminHierarchyTreeComponent,
    CommonModule,
  ],
  providers: [ConfirmationService, DialogService],
})
export class SharedModule {}
