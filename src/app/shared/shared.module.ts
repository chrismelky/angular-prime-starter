import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedMaterialModule } from './shared-material.module';
import { SharedPrimengModule } from './shared-primeng.module';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderComponent } from './loader/loader.component';
import { DraggableDirective } from './draggable.directive';

@NgModule({
  declarations: [LoaderComponent, DraggableDirective],
  imports: [SharedMaterialModule, SharedPrimengModule, CommonModule],
  exports: [
    SharedMaterialModule,
    SharedPrimengModule,
    CommonModule,
    NgxPermissionsModule,
    LoaderComponent,
    DraggableDirective,
  ],
  providers: [ConfirmationService, DialogService],
})
export class SharedModule {}
