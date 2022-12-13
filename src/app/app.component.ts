import { Component, OnInit } from '@angular/core';

import { FirstVisitDisclaimerComponent } from '~components/dialog/first-visit-disclaimer/first-visit-disclaimer.component';
import { environment } from '~env';

import { DialogService } from './services/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  prod = environment.production;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    const key = 'core-keeper-save-editor.disclaimer';
    const disclaimer = window.localStorage.getItem(key);
    if (!disclaimer) {
      this.dialogService
        .open(FirstVisitDisclaimerComponent)
        .afterClosed()
        .subscribe(() => window.localStorage.setItem(key, '1'));
    }
  }
}
