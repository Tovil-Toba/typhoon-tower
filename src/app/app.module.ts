import { HttpClientModule } from '@angular/common/http';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptModule } from '@nativescript/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AndroidCenterDirective } from '~/app/shared/android-center.directive';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoadingLabelComponent } from './loading-label/loading-label.component';
import { SensorsDataComponent } from './sensors-data/sensors-data.component';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    NativeScriptLocalizeModule,
    NativeScriptModule
  ],
  declarations: [
    AndroidCenterDirective,
    AppComponent,
    SensorsDataComponent,
    LoadingLabelComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
