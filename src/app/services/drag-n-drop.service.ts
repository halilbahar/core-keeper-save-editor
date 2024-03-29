import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  CdkDropList
} from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ItemCategories } from '~enums';
import { InventorySlot, ItemData } from '~models';

import { CharacterService } from './character.service';
import { ItemDataService } from './item-data.service';

@Injectable({
  providedIn: 'root'
})
export class DragNDropService {
  private readonly regex = /inventory-(\d+)/;
  private readonly indexAllowedObjectTypes = {
    51: ItemCategories.Helm,
    52: ItemCategories.Necklace,
    53: ItemCategories.BreastArmor,
    54: ItemCategories.PantsArmor,
    55: ItemCategories.Ring,
    56: ItemCategories.Ring,
    57: ItemCategories.Offhand,
    58: ItemCategories.Bag
  };

  $indexToHide: BehaviorSubject<number> = new BehaviorSubject(-1);
  constructor(
    private itemDataService: ItemDataService,
    private characterService: CharacterService
  ) {}

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

    // If the one of the item slots are the 58th one (bag) update the bag subject so we can adjust the inventory size
    if (event.container.id === 'inventory-58') {
      this.characterService.$bag.next(event.container.data.objectID);
    } else if (event.previousContainer.id === 'inventory-58') {
      this.characterService.$bag.next(event.previousContainer.data.objectID);
    }

    // Update the local storage
    this.characterService.store();
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

  /**
   * Predicate whether the item can be dropped into the equipment item slots.
   * This way only the correct items can be dropped.
   * For example: Only rings can be dropped into the ring item slots.
   */
  equipmentEnterPredicate(): (drag: CdkDrag, drop: CdkDropList) => boolean {
    return (drag: CdkDrag<{ objectID: number }>, drop: CdkDropList<InventorySlot>) => {
      const id = drop.id;
      const match = id.match(this.regex);
      const index = parseInt(match[1]);
      const itemData = this.itemDataService.getData(drag.data.objectID);
      // If it is a item we can't display, it is not allowed to go in
      if (itemData == null) {
        return false;
      }
      const itemObjectType = itemData.objectType;

      // If we find an index which is in indexAllowedObjectTypes that means we are handling a equipment predicate.
      // We check if it is the correct objectType
      if (this.indexAllowedObjectTypes[index] != null) {
        return this.indexAllowedObjectTypes[index] === itemObjectType;
      }

      // Else it is an item for the inventory
      return true;
    };
  }

  /**
   * Predicate whether the item can be dropped into the inventory item slots.
   * Without this function you could drop your helm into one slot and the service would switch thoes items.
   * For example: You have a bronze helm equipped but want to drop it into your inventory.
   * If you drop it to the slot with the ancient coins, they both will swap
   */
  InventoryEnterPredicate(): (drag: CdkDrag, drop: CdkDropList) => boolean {
    return (drag: CdkDrag<{ objectID: number }>, drop: CdkDropList<InventorySlot>) => {
      // If the item comes from the item-browser (0 <= index <= 49), allow everything
      const index = parseInt(drag.dropContainer.id.split('-')[1]);
      if (0 <= index && index <= 49) return true;
      // If we are here this means that the item being dragged is from the Equipment slots.
      // We can instantly allow it if the itemslot is empty.
      if (drop.data.objectID === 0) return true;

      // Otherwise we need to see if they are allowed to swap

      const draggingItemType = this.indexAllowedObjectTypes[index];
      const dropItemData = this.itemDataService.getData(drop.data.objectID);

      // If the types are the same, you are allowed to swap the items
      return draggingItemType === dropItemData?.objectType;
    };
  }
}
