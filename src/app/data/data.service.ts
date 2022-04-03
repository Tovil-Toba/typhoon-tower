import { Http, HttpResponse } from '@nativescript/core';
import { Injectable } from '@angular/core';
import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh';

import { CountdownIntervalsService } from '../shared/countdown-intervals.service';
import { LoadOptionsModel } from './load/load-options.model';

@Injectable()
export class DataService {
  isLoading = false;

  constructor(private countdownIntervalsService: CountdownIntervalsService) { }

  get countdownStartTime(): number {
    return this.countdownIntervalsService.currentStartTime;
  }

  load(
    url: string,
    onSuccess: (json) => void,
    options?: LoadOptionsModel,
    pullToRefresh?: PullToRefresh
  ): void {
    this.initOptions(options);

    if (pullToRefresh) {
      pullToRefresh.refreshing = options.isPullToRefreshSpinnerVisible;
    }

    if (this.countdownIntervalsService.currentStartTime === 0) {
      this.countdownIntervalsService.init();
    }

    this.isLoading = true;

    Http.request({
      url,
      method: 'GET'
    }).then(
      (response: HttpResponse) => {
        try {
          const json = response.content.toJSON();
          onSuccess(json);
          this.countdownIntervalsService.reset();
        } catch (e) {
          console.error(e);
          this.countdownIntervalsService.iterate();
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

        this.countdownIntervalsService.iterate();
      }
    );
  }

  private initOptions(options?: LoadOptionsModel): void {
    if (options.countdownIntervals) {
      this.countdownIntervalsService.intervals = options.countdownIntervals;
    }
  }
}
