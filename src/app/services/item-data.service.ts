import { Injectable } from '@angular/core';

import { ItemData } from '~models';

// eslint-disable-next-line no-restricted-imports
import ItemDataJson from '../../assets/item-data.json';

@Injectable({
  providedIn: 'root'
})
export class ItemDataService {
  readonly items: ItemData[] = ItemDataJson;

  constructor() {}

  getData(objectID: number): ItemData {
    for (let item of this.items) {
      if (Object.values(item)[0] === objectID) return item;
    }
    return null;
  }

  getRarityColor(item: ItemData): string {
    switch (item.rarity) {
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
