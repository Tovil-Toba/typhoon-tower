import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-loading-label',
  templateUrl: './loading-label.component.html',
  styleUrls: ['./loading-label.component.scss']
})
export class LoadingLabelComponent implements OnDestroy, OnChanges {
  @Input() class = '';
  @Input() height = 'auto';
  @Input() interval = 1000;
  @Input() isLoading = false;
  @Input() text = 'Загрузка';
  @Input() textAlignment = 'initial';
  @Input() width = 'auto';

  labelText = '';

  private subscription?: Subscription;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isLoading.currentValue) {
      let points = '...';

      this.subscription = timer(0, this.interval).subscribe(() => {
        this.labelText = this.text + points;

        if (points.length === 1) {
          this.labelText += '  ';
        } else if (points.length === 2) {
          this.labelText += ' ';
        }

        if (points.length === 3) {
          points = '.';
        } else {
          points += '.';
        }
      });
    } else {
      this.subscription?.unsubscribe();
      this.labelText = '';
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
