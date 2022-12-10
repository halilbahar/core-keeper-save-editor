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
    const paddedObjectId = objectId.toString().padStart(4, '0');
    const { name, description, rarity, initialAmount, isStackable } = item;
    const rarityColor = this.getRarityColor(item.rarity);
    const whenEquipped = item.whenEquipped;
    const conditionsWhenEquipped = whenEquipped
      ? this.transformConditionIdToLabel(whenEquipped)
      : undefined;
    const setBonus = item.setBonusId ? this.getSetBonusInformation(item.setBonusId) : undefined;

    return {
      objectId,
      paddedObjectId,
      name,
      description,
      initialAmount,
      isStackable,
      rarity,
      rarityColor,
      conditionsWhenEquipped,
      setBonus
    };
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
        const prefix = itemCondition.value >= 0 ? '+' : '';
        // When the template has '{0}%' instead of '{0}' we need to divide the value by 10
        // If it has no '{0}%' the replace will have done nothing and we can replace '{0}' which will succeed
        let result = conditionStringTemplate.replace(
          '{0}%',
          prefix + itemCondition.value / 10 + '%'
        );
        result = result.replace('{0}', prefix + itemCondition.value);
        conditionStrings.push(result);
      } else {
        conditionStrings.push(conditionStringTemplate);
      }
    }

    return conditionStrings;
  }

  /**
   * Base on the setBonusId return the condition label (how many pieces needed and what effect) and which pieces belong to this set.
   * @param setBonusId of the setBonus
   * @returns condition label and pieces
   */
  private getSetBonusInformation(setBonusId: number): { conditions: string[]; pieces: string[] } {
    const setBonusData = this.setBonus[setBonusId];

    const conditions = setBonusData.data.map(data => {
      const { conditionID, value } = data.conditionData;
      // transformConditionIdToLabel needs an array but we have a single item,
      // pass the single item as an array and get the first element afterwards
      const conditionLabel = this.transformConditionIdToLabel([{ id: conditionID, value }])[0];
      return `${data.requiredPieces} set: ${conditionLabel}`;
    });

    const pieces = setBonusData.pieces.map(objectId => this.getData(objectId).name);

    return { conditions, pieces };
  }
}
