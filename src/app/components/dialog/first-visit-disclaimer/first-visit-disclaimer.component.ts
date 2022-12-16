import { Component } from '@angular/core';

import { DialogRef } from '~services';

@Component({
  selector: 'app-first-visit-disclaimer',
  templateUrl: './first-visit-disclaimer.component.html',
  styleUrls: ['./first-visit-disclaimer.component.scss']
})
export class FirstVisitDisclaimerComponent {
  constructor(public dialogRef: DialogRef) {}
}
