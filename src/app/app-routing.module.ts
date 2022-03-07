import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

import { SensorsDataComponent } from '~/app/sensors-data/sensors-data.component';

const routes: Routes = [
  { path: '', redirectTo: '/sensors-data', pathMatch: 'full' },
  { path: 'sensors-data', component: SensorsDataComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
