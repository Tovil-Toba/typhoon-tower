import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { isAndroid, View } from '@nativescript/core';

@Directive({ selector: '[appAndroidCenter]'})
export class AndroidCenterDirective implements OnInit {
  @Input() appAndroidCenter = true;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (isAndroid && this.appAndroidCenter !== false) {
      const view = this.el.nativeElement as View;
      view.on(View.layoutChangedEvent, () => {
        if (isAndroid) {
          view.android.setGravity(17);
        }
      });
    }
  }
}
