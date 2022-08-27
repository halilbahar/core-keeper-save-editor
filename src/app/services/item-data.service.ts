import { Injectable } from '@angular/core';

import { ItemRarity } from '~enums';
import { ItemData } from '~models';

// eslint-disable-next-line no-restricted-imports
import ItemDataJson from '../../assets/item-data.json';

@Injectable({
  providedIn: 'root'
})
export class ItemDataService {
  readonly items: { [key: number]: ItemData } = ItemDataJson;

  getData(objectID: number): ItemData {
    return this.items[objectID] || null;
  }

  getRarityColor(rarity: ItemRarity): string {
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
}
