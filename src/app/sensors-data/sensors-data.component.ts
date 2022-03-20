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
  readonly measurementUnits: string[] = [
    localize('m'),
    localize('m/s'),
    localize('deg'),
    '°C',
    '%'
  ];
  loadingCountdownStartTime = 0;
  readonly rowHeight = '30';
  sensorsData: string[][] = [];
  time?: string;

  private loadingCountdownIteration = -1;
  private readonly loadingCountdownStartTimes = [5, 10, 15];

  constructor(public themeService: ThemeService) {}

  get mainTemperature(): string {
    return this.sensorsData[5]?.[3] ? (this.sensorsData[5][3] + ' °C') : '';
  }

  get rowsHeight(): string {
    return Array.from({ length: this.sensorsData.length }, () => this.rowHeight).join(' ');
  }

  loadData(event?: { eventName: string; object: PullToRefresh }): void {
    const pullToRefresh = event?.object;

    if (pullToRefresh) {
      if (this.loadingCountdownStartTime > 0) {
        pullToRefresh.refreshing = false;

        return;
      }

      pullToRefresh.refreshing = true;
      this.resetLoadingCountdown();
    }

    this.isLoading = true;
    this.clearData();

    Http.request({
      url: API_URL,
      method: 'GET'
    }).then(
      (response: HttpResponse) => {
        try {
          const json = response.content.toJSON() as ResponseModel;
          this.date = json.date;
          this.time = json.time;
          this.sensorsData = json.sensorsData;
        } catch (e) {
          console.error(e);
          this.iterateLoadingCountdown();
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

        this.iterateLoadingCountdown();
      }
    );
  }

  ngOnInit(): void {
    Application.on(Application.resumeEvent, () => {
      if (this.loadingCountdownStartTime === 0) {
        this.resetLoadingCountdown();
        this.loadData();
      }
    });
  }

  private clearData(): void {
    this.date = undefined;
    this.time = undefined;
    this.sensorsData = [];
  }

  private iterateLoadingCountdown(): void {
    const nextCountdownIteration = this.loadingCountdownIteration + 1;

    if (this.loadingCountdownStartTimes[nextCountdownIteration]) {
      this.loadingCountdownIteration = nextCountdownIteration;
      this.loadingCountdownStartTime = this.loadingCountdownStartTimes[nextCountdownIteration];
    } else {
      this.resetLoadingCountdown();
    }
  }

  private resetLoadingCountdown(): void {
    this.loadingCountdownStartTime = 0;
    this.loadingCountdownIteration = -1;
  }
}
