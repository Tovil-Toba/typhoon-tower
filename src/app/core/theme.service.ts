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

  get isLight(): boolean {
    return Theme.getMode() !== Theme.Dark; // потому что есть еще состояние Theme.Auto
  }

  init(): void {
    // const isDarkTheme = ApplicationSettings.getBoolean('isDarkTheme', false); - Неправильно работает
    // на некоторых смартфонах, как и число. Для надежности всегда следует использовать строку.
    const isDarkTheme = ApplicationSettings.getString('isDarkTheme', 'false');
    const mode = isDarkTheme === 'true' ? Theme.Dark : Theme.Light;
    Theme.setMode(mode);
  }

  toggleTheme(): void {
    // Theme.toggleMode(); - Неправильно работает на некоторых смартфонах. Не использовать!
    const mode = this.isDark ? Theme.Light : Theme.Dark;
    Theme.setMode(mode);
    // ApplicationSettings.setBoolean('isDarkTheme', this.isDark); - смотри выше
    const isDarkTheme = this.isDark ? 'true' : 'false';
    ApplicationSettings.setString('isDarkTheme', isDarkTheme);
  }
}
