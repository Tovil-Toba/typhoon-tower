import { Component, DoCheck, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements DoCheck, OnDestroy {
  @Input() class = '';
  @Input() height = 'auto';
  @Input() hidden = false;
  @Input() interval = 1000;
  @Input() startTime = 0;
  @Input() text = '';
  @Input() textAlignment = 'initial';
  @Input() width = 'auto';

  @Output() readonly event = new EventEmitter<void>();

  private isInProgress = false;
  private previousStartTime?: number;
  private subscription?: Subscription;
  private time = 0;

  constructor() { }

  get labelText(): string {
    return this.text + this.time;
  }

  ngDoCheck(): void {
    if (!this.isInProgress &&
      this.startTime > 0 &&
      this.startTime !== this.previousStartTime
    ) {
      this.previousStartTime = this.startTime;
      this.isInProgress = true;
      this.time = this.startTime;

      this.subscription = timer(1000, this.interval).subscribe(() => {
        if (this.time > 0) {
          this.time--;

          if (this.time === 0) {
            this.event.emit();
            this.isInProgress = false;
            this.subscription.unsubscribe();
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
