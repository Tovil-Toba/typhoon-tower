import { HttpClientModule } from '@angular/common/http';
import { NativeScriptModule } from '@nativescript/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DataModule } from '~/app/data/data.module';
import { SensorsDataComponent } from './sensors-data/sensors-data.component';
import { SharedModule } from '~/app/shared/shared.module';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    DataModule,
    HttpClientModule,
    NativeScriptModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
    SensorsDataComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
