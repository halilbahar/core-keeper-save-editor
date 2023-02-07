import { Injectable } from '@angular/core';

import { InventorySlot, ItemData, ItemDetail } from '~models';

import { ItemDataService } from './item-data.service';

@Injectable({
  providedIn: 'root'
})
export class ItemSetService {
  activeConditions: string[] = [];
  activePieces: string[] = [];
  equippedItems: ItemData[] = [];
  constructor(private itemDataService: ItemDataService) {}

  public updateEquippedItems(equipmentSlots: InventorySlot[]) {
    this.equippedItems = this.getEquippedItems(equipmentSlots);
    const setIds = this.getUniqueSets(this.equippedItems);
    this.activeConditions = [];
    this.activePieces = [];

    for (let i = 0; i < setIds.length; i++) {
      let counter = 0;
      let setBonusInformation = this.itemDataService.getSetBonusInformation(setIds[i]);

      for (const equippedItem of this.equippedItems) {
        if (setBonusInformation.pieces.includes(equippedItem.name)) {
          counter++;
          this.activePieces.push(equippedItem.name);
        }
      }

      for (const condition of setBonusInformation.conditions) {
        let conditionAmount: number = +condition.charAt(0);
        if (counter >= conditionAmount) {
          this.activeConditions.push(condition);
        }
      }
    }
  }

  private getEquippedItems(equipmentSlots: InventorySlot[]) {
    let equippedItems: ItemData[] = [];
    for (let i = 0; i < equipmentSlots.length; i++) {
      equippedItems[i] = this.itemDataService.getData(equipmentSlots[i].objectID);
    }

    equippedItems = equippedItems.filter(function (item: ItemData) {
      return item != null;
    });
    return equippedItems
      .map(item => item)
      .filter((value, index, self) => self.indexOf(value) === index);
  }
  private getUniqueSets(items: ItemData[]) {
    return items
      .map(item => item.setBonusId)
      .filter((value, index, self) => self.indexOf(value) === index);
  }
}
