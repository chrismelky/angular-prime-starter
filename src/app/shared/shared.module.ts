import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedMaterialModule } from './shared-material.module';
import { SharedPrimengModule } from './shared-primeng.module';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminHierarchyTreeComponent } from './admin-hierarchy-tree/admin-hierarchy-tree.component';
import { SectionTreeComponent } from './section-tree/section-tree.component';

@NgModule({
  declarations: [AdminHierarchyTreeComponent, SectionTreeComponent],
  imports: [SharedMaterialModule, SharedPrimengModule],
  exports: [
    SharedMaterialModule,
    SharedPrimengModule,
    AdminHierarchyTreeComponent,
    SectionTreeComponent,
    CommonModule,
  ],
  providers: [ConfirmationService, DialogService],
})
export class SharedModule {}
