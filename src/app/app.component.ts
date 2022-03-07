import { Component, OnInit } from '@angular/core';
import Theme from '@nativescript/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor() {}

  get isDarkTheme(): boolean {
    return Theme.getMode() === Theme.Dark;
  }

  ngOnInit(): void {
    // Theme.toggleMode(true);
    Theme.setMode(Theme.Dark);
  }
}
