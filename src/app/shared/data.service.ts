import { Http, HttpResponse } from '@nativescript/core';
import { Injectable } from '@angular/core';
import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh';

import { CountdownIntervalsService } from './countdown-intervals.service';
import { LoadDataOptionsModel } from '~/app/shared/load-data-options.model';

@Injectable()
export class DataService {
  isLoading = false;

  constructor(private countdownIntervals: CountdownIntervalsService) { }

  get countdownStartTime(): number {
    return this.countdownIntervals.currentStartTime;
  }

  load(
    url: string,
    onSuccess: (json) => void,
    options?: LoadDataOptionsModel,
    event?: { eventName: string; object: PullToRefresh }
  ): void {
    this.initLoadOptions(options);

    const pullToRefresh = event?.object;

    if (pullToRefresh) {
      if (this.countdownIntervals.currentStartTime > 0) {
        pullToRefresh.refreshing = false;

        return;
      }

      pullToRefresh.refreshing = true;
    }

    if (this.countdownIntervals.currentStartTime === 0) {
      this.countdownIntervals.init();
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
          this.countdownIntervals.reset();
        } catch (e) {
          console.error(e);
          this.countdownIntervals.iterate();
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

        this.countdownIntervals.iterate();
      }
    );
  }

  private initLoadOptions(options?: LoadDataOptionsModel): void {
    if (options.countdownIntervals) {
      this.countdownIntervals.intervals = options.countdownIntervals;
    }
  }
}
