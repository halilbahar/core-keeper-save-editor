import { Pipe, PipeTransform } from '@angular/core';

import { Bag } from '~enums';
import { InventorySlot } from '~models';
import { CharacterService } from '~services';

@Pipe({
  name: 'inventory'
})
export class InventoryPipe implements PipeTransform {
  constructor(private characterService: CharacterService) {}

  transform(inventory: InventorySlot[], bag: Bag): InventorySlot[] {
    // Get the bagSize and show the inventory based on the bag size.
    const bagSize = this.characterService.getBagSize(bag);
    return inventory.slice(0, 30 + bagSize);
  }
}
