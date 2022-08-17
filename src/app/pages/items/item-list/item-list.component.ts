import { Component, Input, OnInit } from '@angular/core';

import { SelectedItemService } from 'src/app/services/selected-item.service';
import { InventorySlot } from '~models';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent {
  @Input() isEditable: boolean;
  @Input() inventory: InventorySlot[] = [];

  constructor() {}
}
