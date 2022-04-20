import { Injectable } from '@angular/core';

import { ItemData } from '~models';

// eslint-disable-next-line no-restricted-imports
import ItemDataJson from '../../assets/item_data.json';

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
}
