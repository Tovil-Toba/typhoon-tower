import { Application } from '@nativescript/core';
import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { localize } from '@nativescript/localize';
import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh';

import { CountdownIntervalsService } from '../../shared/countdown-intervals.service';
import { DataService } from '../data.service';
import { LoadOptionsModel } from './load-options.model';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss'],
  providers: [CountdownIntervalsService, DataService]
})
export class LoadComponent implements DoCheck, OnInit {
  @Input() class = '';
  @Input() countdownText = localize('New try in');
  @Input() interval = 1000;
  @Input() height = 'auto';
  @Input() loadingText = localize('Loading');
  @Input() options: LoadOptionsModel = {
    countdownIntervals: [5, 10, 15],
    isPullToRefreshSpinnerVisible: false
  };
  @Input() pullToRefresh?: PullToRefresh;
  @Input() reloadDataTrigger?: number;
  @Input() textAlignment = 'initial';
  @Input() tryLaterText = localize('Please try again later');
  @Input() url = '';
  @Input() width = 'auto';

  @Output() readonly data = new EventEmitter<any>();
  @Output() readonly loading = new EventEmitter<boolean>();

  isDataEmitted = false;

  private isCountdownInProgress = false;
  private previousIsLoading = this.dataService.isLoading;
  private previousReloadDataTrigger?: number;

  constructor(
    private countdownIntervalsService: CountdownIntervalsService,
    private dataService: DataService
  ) { }

  get countdownStartTime(): number {
    return this.dataService.countdownStartTime;
  }

  get isCountdownHidden(): boolean {
    return this.isLoading || this.isDataEmitted || this.countdownStartTime === 0;
  }

  get isTryLaterLabelHidden(): boolean {
    return this.isLoading || this.isDataEmitted || this.countdownStartTime > 0;
  }

  get isLoading(): boolean {
    return this.dataService.isLoading;
  }

  loadData(): void {
    this.isDataEmitted = false;
    const onSuccess = (json): void => {
      this.isDataEmitted = true;
      this.data.emit(json);
    };
    this.dataService.load(this.url, onSuccess, this.options, this.pullToRefresh);
  }

  ngDoCheck(): void {
    if (this.isLoading !== this.previousIsLoading) {
      this.previousIsLoading = this.isLoading;
      this.loading.emit(this.isLoading);
    }

    if (this.reloadDataTrigger !== this.previousReloadDataTrigger) {
      this.previousReloadDataTrigger = this.reloadDataTrigger;

      if (!this.isCountdownInProgress) { //  && !this.countdownIntervalsService.isInProgress
        this.loadData();
      } else if (this.pullToRefresh) {
        this.pullToRefresh.refreshing = false;
      }
    }
  }

  ngOnInit(): void {
    Application.on(Application.resumeEvent, () => {
      if (this.countdownStartTime === 0 || !this.countdownIntervalsService.isInProgress) {
        this.loadData();
      }
    });
  }

  setCountdownInProgress(isCountdownInProgress: boolean): void {
    this.isCountdownInProgress = isCountdownInProgress;
  }
}
