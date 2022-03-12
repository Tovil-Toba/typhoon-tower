import { Application, Http, HttpResponse } from '@nativescript/core';
import { Component, OnInit } from '@angular/core';
import { localize } from '@nativescript/localize';
import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh';
import { registerElement } from '@nativescript/angular';
import { ThemeService } from '~/app/shared/theme.service';

import { API_URL } from '~/app/shared/config';
import { ResponseModel } from '~/app/sensors-data/response.model';

registerElement('PullToRefresh', () => PullToRefresh);

@Component({
  selector: 'app-sensors-data',
  templateUrl: './sensors-data.component.html',
})
export class SensorsDataComponent implements OnInit {
  date?: string;
  isLoading = false;
  measurementUnits: string[] = [
    localize('m'),
    localize('m/s'),
    localize('deg'),
    '°C',
    '%'
  ];
  rowHeight = '30';
  sensorsData: string[][] = [];
  time?: string;

  constructor(public themeService: ThemeService) {}

  get mainTemperature(): string {
    return this.sensorsData[5]?.[3] ? (this.sensorsData[5][3] + ' °C') : '';
  }

  get rowsHeight(): string {
    return Array.from({ length: this.sensorsData.length }, () => this.rowHeight).join(' ');
  }

  loadData(event?: { eventName: string; object: PullToRefresh }): void {
    this.clearData();
    const pullToRefresh = event?.object;
    this.isLoading = true;

    if (pullToRefresh) {
      event.object.refreshing = true;
    }

    Http.request({
      url: API_URL,
      method: 'GET'
    }).then(
      (response: HttpResponse) => {
        if (response.statusCode === 200 && response.content) {
          try {
            const json = response.content.toJSON() as ResponseModel;
            this.date = json.date;
            this.time = json.time;
            this.sensorsData = json.sensorsData;
          } catch(e) {}
        }

        this.isLoading = false;

        if (pullToRefresh) {
          pullToRefresh.refreshing = false;
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;

        if (pullToRefresh) {
          pullToRefresh.refreshing = false;
        }
      }
    );
  }

  ngOnInit(): void {
    Application.on(Application.resumeEvent, () => {
      this.loadData();
    });
  }

  private clearData(): void {
    this.date = undefined;
    this.time = undefined;
    this.sensorsData = [];
  }
}
