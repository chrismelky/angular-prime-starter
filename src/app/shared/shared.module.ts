import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedMaterialModule } from './shared-material.module';
import { SharedPrimengModule } from './shared-primeng.module';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminHierarchyTreeComponent } from './admin-hierarchy-tree/admin-hierarchy-tree.component';
import { SectionTreeComponent } from './section-tree/section-tree.component';
import { ObjectiveTreeComponent } from './objective-tree/objective-tree.component';
import {AssessmentTreeComponent} from "./assessment-tree/assessment-tree.component";
import {NgxPermissionsModule} from "ngx-permissions";

@NgModule({
  declarations: [
    AdminHierarchyTreeComponent,
    SectionTreeComponent,
    ObjectiveTreeComponent,
    AssessmentTreeComponent,
  ],
  imports: [SharedMaterialModule, SharedPrimengModule],
  exports: [
    SharedMaterialModule,
    SharedPrimengModule,
    AdminHierarchyTreeComponent,
    SectionTreeComponent,
    ObjectiveTreeComponent,
    AssessmentTreeComponent,
    CommonModule,
    NgxPermissionsModule,
  ],
  providers: [ConfirmationService, DialogService],
})
export class SharedModule {}
