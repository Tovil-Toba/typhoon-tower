import { Injectable } from '@angular/core';

@Injectable()
export class CountdownIntervalsService {
  intervals = [5, 10, 15];

  private iteration = -1;
  private startTime = 0;

  constructor() { }

  get currentStartTime(): number {
    return this.startTime;
  }

  init(intervals?: number[]): void {
    if (intervals) {
      this.intervals = intervals;
    }

    this.reset();
  }

  iterate(): void {
    const nextIteration = this.iteration + 1;

    if (this.intervals[nextIteration]) {
      this.iteration = nextIteration;
      this.startTime = this.intervals[nextIteration];
    } else {
      this.reset();
    }
  }

  reset(): void {
    this.startTime = 0;
    this.iteration = -1;
  }
}
