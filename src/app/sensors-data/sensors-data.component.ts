import { Application } from '@nativescript/core';
import { Component, OnInit } from '@angular/core';
import { localize } from '@nativescript/localize';
import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh';
import { registerElement } from '@nativescript/angular';

import { API_URL } from '~/app/shared/config';
import { CountdownIntervalsService } from '~/app/shared/countdown-intervals.service';
import { DataService } from '~/app/shared/data.service';
import { LoadDataOptionsModel } from '~/app/shared/load-data-options.model';
import { ResponseModel } from '~/app/sensors-data/response.model';
import { ThemeService } from '~/app/shared/theme.service';

registerElement('PullToRefresh', () => PullToRefresh);

@Component({
  selector: 'app-sensors-data',
  templateUrl: './sensors-data.component.html',
  providers: [CountdownIntervalsService, DataService]
})
export class SensorsDataComponent implements OnInit {
  date?: string;
  readonly measurementUnits: string[] = [
    localize('m'),
    localize('m/s'),
    localize('deg'),
    '°C',
    '%'
  ];
  readonly rowHeight = '30';
  sensorsData: string[][] = [];
  time?: string;

  private readonly loadDataOptions: LoadDataOptionsModel = {
    countdownIntervals: [5, 10, 15]
  };

  constructor(
    private dataService: DataService,
    public theme: ThemeService
  ) { }

  get countdownStartTime(): number {
    return this.dataService.countdownStartTime;
  }

  get isLoading(): boolean {
    return this.dataService.isLoading;
  }

  get mainTemperature(): string {
    return this.sensorsData[5]?.[3] ? (this.sensorsData[5][3] + ' °C') : '';
  }

  get rowsHeight(): string {
    return Array.from({ length: this.sensorsData.length }, () => this.rowHeight).join(' ');
  }

  loadData(event?: { eventName: string; object: PullToRefresh }): void {
    this.clearData();
    const onSuccess = (json: ResponseModel): void => {
      this.date = json.date;
      this.time = json.time;
      this.sensorsData = json.sensorsData;
    };
    this.dataService.load(API_URL, onSuccess, this.loadDataOptions, event);
  }

  ngOnInit(): void {
    Application.on(Application.resumeEvent, () => {
      if (this.countdownStartTime === 0) {
        this.loadData();
      }
    });
  }

  private clearData(): void {
    this.date = undefined;
    this.time = undefined;
    this.sensorsData = [];
  }
}
