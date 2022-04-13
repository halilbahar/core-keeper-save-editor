import { Injectable } from '@angular/core';
import ItemDataJson from '../../assets/item_data.json';
import { ItemData } from '~models';

@Injectable({
  providedIn: 'root'
})
export class ItemDataService {

  private items: ItemData[] = ItemDataJson

  constructor() {}

  getData(objectID: number): ItemData {
    for (let item of this.items) {
      if (Object.values(item)[0] === objectID) return item
    }
    return undefined
  }
}
