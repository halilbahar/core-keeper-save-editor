import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { InventorySlot } from '~models';

@Injectable({
  providedIn: 'root'
})
export class SelectedItemService {
  private _$selectedItem: BehaviorSubject<InventorySlot> = new BehaviorSubject(null);
  readonly $selectedItem: Observable<InventorySlot> = this._$selectedItem.asObservable();

  constructor() {}

  setSelectedItem(inventorySlot: InventorySlot) {
    this._$selectedItem.next(inventorySlot);
  }
}
