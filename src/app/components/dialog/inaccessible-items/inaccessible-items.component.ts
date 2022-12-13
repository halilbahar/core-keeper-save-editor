import { Component } from '@angular/core';

import { DialogRef } from '~services';

@Component({
  selector: 'app-inaccessible-items',
  templateUrl: './inaccessible-items.component.html',
  styleUrls: ['./inaccessible-items.component.scss']
})
export class InaccessibleItemsComponent {
  constructor(private dialogRef: DialogRef) {}

  /**
   * Cancel this dialog by sending false back.
   */
  cancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * okay this dialog by sending true back.
   */
  ok(): void {
    this.dialogRef.close(true);
  }
}
