import { Injectable } from '@angular/core';

import { ItemData as ItemDataJson } from '~data';
import { ItemRarity } from '~enums';
import { ItemData, ItemDetail, SetBonus } from '~models';

import { ConditionDataService } from './condition-data.service';

@Injectable({
  providedIn: 'root'
})
export class ItemDataService {
  private readonly setBonus: { [key: string]: SetBonus };
  readonly items: { [key: number]: ItemData };

  constructor(private conditionDataService: ConditionDataService) {
    this.setBonus = ItemDataJson.setBonuses as unknown as { [key: string]: SetBonus };
    this.items = ItemDataJson.items as unknown as { [key: number]: ItemData };
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
   * Get all the needed information of a item to display it. If the item does not exist, return null.
   * @param objectId of the needed item
   * @returns ItemDetail
   */
  getItemDetail(objectId: number): ItemDetail {
    const item = this.getData(objectId);
    if (item == null) {
      return null;
    }
    const paddedObjectId = objectId.toString().padStart(4, '0');
    const { name, description, rarity, initialAmount, isStackable, damage, cooldown } = item;
    const rarityColor = this.getRarityColor(item.rarity);
    const whenEquipped = item.whenEquipped;
    const conditionsWhenEquipped = whenEquipped
      ? this.conditionDataService.transformConditionIdsToLabel(whenEquipped, 'item', true)
      : undefined;
    const setBonus = item.setBonusId ? this.getSetBonusInformation(item.setBonusId) : undefined;

    if (damage) {
      damage.reinforcementBonus = Math.round(
        (damage.range[0] + (damage.range[1] - damage.range[0]) / 2) * 0.15
      );
    }

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
      damage,
      cooldown,
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
      const conditionLabel = this.conditionDataService.transformConditionIdsToLabel(
        [{ id: conditionID, value }],
        'item'
      )[0][0];
      return `${data.requiredPieces} set: ${conditionLabel}`;
    });

    const pieces = setBonusData.pieces.map(objectId => this.getData(objectId).name);

    return { conditions, pieces };
  }
}
