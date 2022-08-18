import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { ItemData } from '~models';
import { ItemDataService } from '~services';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  private _scale: number = 1;
  @Input() objectID: number;
  @HostBinding('style') style: string = `--individual-scale: ${this._scale};`;
  itemData: ItemData;

  @Input() set scale(value) {
    this._scale = value;
    this.style = `--individual-scale: ${this._scale};`;
  }

  constructor(private itemDataService: ItemDataService) {}

  ngOnInit(): void {
    this.itemData = this.itemDataService.getData(this.objectID);
  }
}
