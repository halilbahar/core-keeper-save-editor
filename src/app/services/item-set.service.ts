import { Injectable } from '@angular/core';

import { InventorySlot, ItemData, ItemDetail } from '~models';

import { CharacterService } from './character.service';
import { ItemDataService } from './item-data.service';

@Injectable({
  providedIn: 'root'
})
export class ItemSetService {
  activeConditions: string[] = [];
  activePieces: string[] = [];
  constructor(
    private itemDataService: ItemDataService,
    private characterService: CharacterService
  ) {}

  public highlightBonus(objectId: number, setBonus: { conditions: string[]; pieces: string[] }) {
    const equippedItems = this.getEquippedItems();
    this.activeConditions = [];
    this.activePieces = [];

    if (setBonus != null) {
      let counter = 0;

      for (const equippedItem of equippedItems) {
        if (setBonus.pieces.includes(equippedItem.name)) {
          counter++;
          this.activePieces.push(equippedItem.name);
        }
      }

      for (const condition of setBonus.conditions) {
        let conditionAmount: number = +condition.charAt(0);
        if (counter >= conditionAmount) {
          this.activeConditions.push(condition);
        }
      }
    }
  }

  private getEquippedItems() {
    let equippedItems: ItemData[] = [];
    for (
      let i = 0;
      i < this.characterService.$character.value.inventory.slice(51, 58 + 1).length;
      i++
    ) {
      equippedItems[i] = this.itemDataService.getData(
        this.characterService.$character.value.inventory.slice(51, 58 + 1)[i].objectID
      );
    }

    equippedItems = equippedItems.filter(function (item: ItemData) {
      return item != null;
    });
    return equippedItems
      .map(item => item)
      .filter((value, index, self) => self.indexOf(value) === index);
  }
}
