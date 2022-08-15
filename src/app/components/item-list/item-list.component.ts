import { Component, Input, OnInit } from '@angular/core';

import { InventorySlot } from '~models';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent {
  @Input() inventory: InventorySlot[] = [];

  constructor() {}
}
