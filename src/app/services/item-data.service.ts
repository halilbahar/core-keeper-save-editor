import { Injectable } from '@angular/core';

import { ItemRarity } from '~enums';
import { ConditionWhenEquipped, ItemData, ItemDetail, SetBonus } from '~models';

import { ExtractedDataService } from './extracted-data.service';

@Injectable({
  providedIn: 'root'
})
export class ItemDataService {
  private readonly conditionLabels: { [key: number]: string };
  private readonly setBonus: { [key: string]: SetBonus };
  readonly items: { [key: number]: ItemData };

  constructor(extractedData: ExtractedDataService) {
    this.items = extractedData.data.items;
    this.conditionLabels = extractedData.data.conditions;
    this.setBonus = extractedData.data.setBonuses;
  }

  /**
   * Get the item-data by objectID. If there is no item with that id return null
   * @param objectID of the item-data
   * @returns item-data
   */
  getData(objectID: number): ItemData {
    return this.items[objectID] || null;
  }

  /**
   * Get all the needed information of a item to display it
   * @param objectId of the needed item
   * @returns ItemDetail
   */
  getItemDetail(objectId: number): ItemDetail {
    const item = this.getData(objectId);
    console.log(objectId);
    const paddedObjectId = objectId.toString().padStart(4, '0');
    const { name, description } = item;
    const rarityColor = this.getRarityColor(item.rarity);
    const whenEquipped = item.whenEquipped;
    const conditionsWhenEquipped = whenEquipped
      ? this.transformConditionIdToLabel(whenEquipped)
      : [];

    return { objectId: paddedObjectId, name, description, rarityColor, conditionsWhenEquipped };
  }

  /**
   * Based on the item rarity, return the corresponding color
   * @param rarity
   * @returns color for the given rarity
   */
  private getRarityColor(rarity: ItemRarity): string {
    switch (rarity) {
      case -1:
        return '#adadad';
      case 1:
        return '#38c54f';
      case 2:
        return '#328aff';
      case 3:
        return '#cd3bbd';
      case 4:
        return '#ffb426';
      default:
        return '#ffffff';
    }
  }

  /**
   * Turn the given item conditions from key (id), value to a string which describes the condition with the given value.
   * @param itemConditions to transform
   * @returns list of described conditions
   */
  private transformConditionIdToLabel(itemConditions: ConditionWhenEquipped[]): string[] {
    const conditionStrings: string[] = [];

    for (let itemCondition of itemConditions) {
      const conditionStringTemplate = this.conditionLabels[itemCondition.id];

      if (conditionStringTemplate.includes('{0}')) {
        const prefix = itemCondition.value >= 0 ? '+' : '-';
        conditionStrings.push(conditionStringTemplate.replace('{0}', prefix + itemCondition.value));
      } else {
        conditionStrings.push(conditionStringTemplate);
      }
    }

    return conditionStrings;
  }

  // getSetBonusInformation(setBonusId): [string[], string[]] {
  //   const setBonusData = this.setBonus[setBonusId];
  //   setBonusData.data.map(data => {
  //     return `${data.requiredPieces} set: ${this.transformConditionIdToLabel([
  //       data.conditionData
  //     ])}`;
  //   });
  //   console.log(setBonusData);
  //   return [[''], ['']];
  // }
}
