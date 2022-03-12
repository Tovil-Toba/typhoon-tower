import { Component, OnInit } from '@angular/core';

import { ThemeService } from '~/app/shared/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.init();
  }
}
