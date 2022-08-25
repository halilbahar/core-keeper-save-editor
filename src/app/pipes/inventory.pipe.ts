import { Pipe, PipeTransform } from '@angular/core';

import { Bag } from '~enums';
import { InventorySlot } from '~models';

@Pipe({
  name: 'inventory'
})
export class InventoryPipe implements PipeTransform {
  transform(inventory: InventorySlot[], bag: Bag): InventorySlot[] {
    // If the item slot has no item or is somehow another time, only show the basic 30 inventory slots
    if (!Object.values(Bag).includes(bag) || bag === Bag.None) {
      return inventory.slice(0, 30);
    }

    let bagSize: number;
    switch (bag) {
      case Bag.CavePouch:
        bagSize = 5;
        break;
      case Bag.ExplorerBackpack:
        bagSize = 10;
        break;
      case Bag.GhormsStomachBag:
        bagSize = 12;
        break;
      case Bag.ScarletShellBackpack:
        bagSize = 15;
        break;
      case Bag.MorphasBubbleBag:
      case Bag.OctarineBag:
        bagSize = 20;
        break;
    }

    return inventory.slice(0, 30 + bagSize);
  }
}
