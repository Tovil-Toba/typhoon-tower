import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AndroidCenterDirective } from '~/app/shared/android-center.directive';
import { CountdownComponent } from '~/app/shared/countdown/countdown.component';

@NgModule({
  declarations: [
    AndroidCenterDirective,
    CountdownComponent
  ],
  imports: [
    NativeScriptLocalizeModule,
    CommonModule
  ],
  exports: [
    AndroidCenterDirective,
    NativeScriptLocalizeModule,
    CountdownComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule { }
