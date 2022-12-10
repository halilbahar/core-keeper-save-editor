import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedItemService {
  $selectedItem = new BehaviorSubject<number>(null);

  constructor() {}

  setSelectedItem(inventorySlotIndex: number) {
    this.$selectedItem.next(inventorySlotIndex);
  }
}
