import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    FlexLayoutModule,
    MatDialogModule,
    MatExpansionModule,
    MatMenuModule,
  ],
})
export class SharedMaterialModule {}
