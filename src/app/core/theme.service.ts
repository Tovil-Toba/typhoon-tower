import { ApplicationSettings } from '@nativescript/core';
import { Injectable } from '@angular/core';
import Theme from '@nativescript/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() { }

  get isDark(): boolean {
    return Theme.getMode() === Theme.Dark;
  }

  init(): void {
    const isDarkTheme = ApplicationSettings.getBoolean('isDarkTheme');
    // Theme.toggleMode(isDarkTheme); - не работает
    const mode = isDarkTheme ? Theme.Dark : Theme.Light;
    Theme.setMode(mode);
  }

  toggleTheme(): void {
    Theme.toggleMode();
    ApplicationSettings.setBoolean('isDarkTheme', this.isDark);
  }
}
