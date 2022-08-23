import { CdkDragDrop, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { InventorySlot, ItemData } from '~models';

@Injectable({
  providedIn: 'root'
})
export class DragNDropService {
  $indexToHide: BehaviorSubject<number> = new BehaviorSubject(-1);
  constructor() {}

  /**
   * Event handler for the drop event on all item-slots.
   * When the item is droped from the item-browser, a new copy is made.
   * When the item is dropped from another item-slot, the data gets swapped.
   * This mean when the old item-slot is not empty, the 2 items will swap places.
   * @param event CdkDragDrop Event
   */
  onDrop(event: CdkDragDrop<InventorySlot, InventorySlot, ItemData>): void {
    let objectID: number;
    let amount: number;
    let variation: number;
    let variationUpdateCount: number;
    console.log(event);

    if (event.previousContainer.id.startsWith('inventory')) {
      // If the item came from the inventory, get the data from the data of the container and reset or swap the items
      objectID = event.previousContainer.data.objectID;
      amount = event.previousContainer.data.amount;
      variation = event.previousContainer.data.variation;
      variationUpdateCount = event.previousContainer.data.variationUpdateCount;

      // swap the items. If the dropped slot is empty, the old slot will be empty. If the dropped has an item, the old slot will be that item
      const oldObjectID = event.container.data.objectID;
      const oldAmount = event.container.data.amount;
      const oldVariation = event.container.data.variation;
      const oldVariationUpdateCount = event.container.data.variationUpdateCount;

      event.previousContainer.data.objectID = oldObjectID;
      event.previousContainer.data.amount = oldAmount;
      event.previousContainer.data.variation = oldVariation;
      event.previousContainer.data.variationUpdateCount = oldVariationUpdateCount;
    } else {
      // If the item came from the item-browser, get the data from the item as ItemData
      objectID = event.item.data.objectID;
      amount = event.item.data.initialAmount;
      variation = 0;
      variationUpdateCount = 0;
    }

    event.container.data.objectID = objectID;
    event.container.data.amount = amount;
    event.container.data.variation = variation;
    event.container.data.variationUpdateCount = variationUpdateCount;

    // If the item is dropped the exit event never gets called, thus the index is still set. Reset it
    this.$indexToHide.next(-1);
  }

  /**
   * Event handler for the enter drop event on all item item-slots.
   * If the item enters find out the index and assign it to the indexToHide variable,
   * so it can be hidden in app-item
   * @param event CdkDragEnter Event
   */
  onEnter(event: CdkDragEnter<unknown>): void {
    const id = event.container.id;
    const regex = /inventory-(\d+)/;
    const match = id.match(regex);
    this.$indexToHide.next(+match[1]);
  }

  /**
   * Event handler for the exit drop event on all item item-slots.
   * Unset the indexToHide variable so all items are shown.
   * @param event CdkDragEnter Event
   */
  onExit(event: CdkDragExit<unknown>) {
    this.$indexToHide.next(-1);
  }
}