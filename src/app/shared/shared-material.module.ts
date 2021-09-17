import {NgModule} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [],
  exports: [FormsModule, ReactiveFormsModule, FlexLayoutModule, MatChipsModule, MatCheckboxModule, MatFormFieldModule, MatSelectModule],
})
export class SharedMaterialModule {
}
