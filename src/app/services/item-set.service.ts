import { Injectable } from '@angular/core';

import { SetBonusDetail } from '~models';

import { CharacterService } from './character.service';
import { ConditionDataService } from './condition-data.service';
import { ItemDataService } from './item-data.service';

@Injectable({
  providedIn: 'root'
})
export class ItemSetService {
  constructor(
    private itemDataService: ItemDataService,
    private characterService: CharacterService,
    private conditionDataService: ConditionDataService
  ) {}

  getSetBonusDetail(objectId: number): SetBonusDetail {
    const result: SetBonusDetail = { pieces: [], conditions: [] };
    const equippedItemIds = this.characterService.$character.value.inventory
      .slice(51, 58 + 1)
      .map(inventorySlot => inventorySlot.objectID);

    // Check if item belongs to a set, if not, return empty
    const itemData = this.itemDataService.getData(objectId);
    if (!itemData?.setBonusId) {
      return result;
    }

    const setBonus = this.itemDataService.setBonus[itemData.setBonusId];

    // Go over all equipped pieces and check if they belong to the current setBonus
    // These will be our highlighted (equipped items)
    const pieces = [];
    const tmp = [];
    for (const equippedItemId of equippedItemIds) {
      if (setBonus.pieces.includes(equippedItemId)) {
        const name = this.itemDataService.getItemDetail(equippedItemId).name;
        pieces.push({ name, isHighlighted: true });
        tmp.push(equippedItemId);
      }
    }
    // Now for the items that are not equipped, thus not highlighted
    let difference = setBonus.pieces.filter(x => !tmp.includes(x));
    for (let objectId of difference) {
      const name = this.itemDataService.getItemDetail(objectId).name;
      pieces.push({ name, isHighlighted: false });
    }

    // remove duplicates like rings
    // https://stackoverflow.com/a/58429784/11125147
    result.pieces = [...new Map(pieces.map(item => [item['name'], item])).values()];
    const wearingPieces = result.pieces.filter(piece => piece.isHighlighted).length;

    // Map the setBonus.data to a proper label and if the label is highlighted
    for (const condition of setBonus.data) {
      const { conditionID, value } = condition.conditionData;
      const requiredPieces = condition.requiredPieces;
      // transformConditionIdToLabel needs an array, but we have a single item,
      // pass the single item as an array and get the first element afterwards
      const conditionLabel = this.conditionDataService.transformConditionIdsToLabel(
        [{ id: conditionID, value }],
        'item'
      )[0][0];
      const label = `${condition.requiredPieces} set: ${conditionLabel}`;
      result.conditions.push({ label, isHighlighted: requiredPieces <= wearingPieces });
    }

    return result;
  }
}
