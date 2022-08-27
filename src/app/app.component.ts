import { Component } from '@angular/core';

import { environment } from '~env';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'core-keeper-save-editor';
  prod = environment.production;
}
