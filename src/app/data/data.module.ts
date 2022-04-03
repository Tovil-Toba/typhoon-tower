import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LoadComponent } from './load/load.component';
import { LoadingLabelComponent } from './loading-label/loading-label.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LoadComponent,
    LoadingLabelComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    LoadComponent,
    LoadingLabelComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class DataModule { }
