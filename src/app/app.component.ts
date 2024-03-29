import { Component, OnInit } from '@angular/core';

import { ThemeService } from '~/app/core/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(public theme: ThemeService) {}

  ngOnInit(): void {
    this.theme.init();
  }
}
