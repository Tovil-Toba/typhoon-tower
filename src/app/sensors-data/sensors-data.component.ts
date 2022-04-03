import { Component } from '@angular/core';
import { localize } from '@nativescript/localize';
import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh';
import { registerElement } from '@nativescript/angular';

import { API_URL } from '~/app/core/config';
import { LoadOptionsModel } from '~/app/data/load/load-options.model';
import { ResponseModel } from '~/app/sensors-data/response.model';
import { ThemeService } from '~/app/core/theme.service';

registerElement('PullToRefresh', () => PullToRefresh);

@Component({
  selector: 'app-sensors-data',
  templateUrl: './sensors-data.component.html',
  styleUrls: ['./sensors-data.component.scss']
})
export class SensorsDataComponent {
  readonly loadDataOptions: LoadOptionsModel = {
    countdownIntervals: [5, 10, 15],
    isPullToRefreshSpinnerVisible: false
  };
  readonly measurementUnits: string[] = [
    localize('m'),
    localize('m/s'),
    localize('deg'),
    '°C',
    '%'
  ];
  readonly rowHeight = '30';
  readonly url = API_URL;

  date?: string;
  isLoading = false;
  pullToRefresh?: PullToRefresh;
  reloadDataTrigger?: number;
  sensorsData: string[][] = [];
  time?: string;

  constructor(
    public theme: ThemeService
  ) { }

  get mainTemperature(): string {
    return this.sensorsData[5]?.[3] ? (this.sensorsData[5][3] + ' °C') : '';
  }

  get rowsHeight(): string {
    return Array.from({ length: this.sensorsData.length }, () => this.rowHeight).join(' ');
  }

  setData(data: ResponseModel): void {
    this.clearData();
    this.date = data.date;
    this.time = data.time;
    this.sensorsData = data.sensorsData;
  }

  setLoading(isLoading: boolean): void {
    setTimeout(() => {
      this.isLoading = isLoading;
    });
  }

  reloadData(event?: { eventName: string; object: PullToRefresh }): void {
    this.pullToRefresh = event?.object;
    this.clearData();
    this.reloadDataTrigger = Date.now();
  }

  private clearData(): void {
    this.date = undefined;
    this.time = undefined;
    this.sensorsData = [];
  }
}
