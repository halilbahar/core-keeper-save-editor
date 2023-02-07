import { Injectable } from '@angular/core';

import { InventorySlot, ItemData, ItemDetail } from '~models';

import { ItemDataService } from './item-data.service';
import { distinct } from "rxjs";
import {
  convertElementSourceSpanToLoc
} from "@angular-eslint/template-parser/dist/template-parser/src/convert-source-span-to-loc";

@Injectable({
  providedIn: 'root'
})
export class ItemSetService {
  constructor(private itemDataService: ItemDataService) {}
  public getActiveSets(equipmentSlots: InventorySlot[]) {
    const equippedItems = this.getEquippedItems(equipmentSlots);
    const setIds = this.getUniqueSets(equippedItems);
    const activeConditions: string[] = [];
    const activeItems: string[] = [];

    for (let i = 0; i < setIds.length; i++) {
      let counter = 0;
      let setBonusInformation = this.itemDataService.getSetBonusInformation(setIds[i]);

      for (const equippedItem of equippedItems) {
        if (setBonusInformation.pieces.includes(equippedItem.name)) {
          counter++;
          activeItems.push(equippedItem.name);
        }
      }

      console.log(counter + ' Items of Set ' + setIds[i]);
      for (const condition of setBonusInformation.conditions) {
        let conditionAmount: number = +condition.charAt(0);
        if (counter >= conditionAmount) {
          activeConditions.push(condition);
        }
      }
    }

    console.log(activeItems);
    console.log(activeConditions);
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
