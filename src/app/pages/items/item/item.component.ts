import { Component, HostBinding, Input } from '@angular/core';

import { ItemData } from '~models';
import { ItemDataService } from '~services';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  private _objectID: number;
  private _scale: number = 1;
  @HostBinding('style') style: string = `--individual-scale: ${this._scale};`;
  itemData: ItemData;

  @Input() set scale(value) {
    this._scale = value;
    this.style = `--individual-scale: ${this._scale};`;
  }

  @Input() set objectID(value) {
    this._objectID = value;
    this.itemData = this.itemDataService.getData(value);
  }

  constructor(private itemDataService: ItemDataService) {}
}
