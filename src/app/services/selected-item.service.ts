import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { InventorySlot, SelectedInventorySlot } from '~models';

@Injectable({
  providedIn: 'root'
})
export class SelectedItemService {
  $selectedItem: BehaviorSubject<SelectedInventorySlot> = new BehaviorSubject(null);

  constructor() {}

  setSelectedItem(item: InventorySlot, isEditable: boolean) {
    this.$selectedItem.next({ inventorySlot: item, isEditable });
  }
}
