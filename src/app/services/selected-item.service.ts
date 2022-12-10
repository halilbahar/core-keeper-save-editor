import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { InventorySlot } from '~models';

@Injectable({
  providedIn: 'root'
})
export class SelectedItemService {
  private _$selectedItem = new BehaviorSubject<number>(null);
  readonly $selectedItem: Observable<number> = this._$selectedItem.asObservable();

  constructor() {}

  setSelectedItem(inventorySlotIndex: number) {
    this._$selectedItem.next(inventorySlotIndex);
  }
}
