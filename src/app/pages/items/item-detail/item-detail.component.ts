import { Component, OnInit } from '@angular/core';

import { ItemRarity } from 'src/app/enums/item-rarity';
import { InventorySlot, ItemData } from '~models';
import { ItemDataService, SelectedItemService } from '~services';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  item: ItemData;
  inventorySlot: InventorySlot;
  isEditable: boolean;

  constructor(
    private itemDataService: ItemDataService,
    private selectedItemService: SelectedItemService
  ) {}

  ngOnInit(): void {
    this.selectedItemService.$selectedItem.subscribe(data => {
      // if (data) {
      //   this.item = this.itemDataService.getData(data.inventorySlot.objectID);
      //   this.inventorySlot = data.inventorySlot;
      //   this.isEditable = data.isEditable;
      //   console.log(data.inventorySlot);
      // }
    });
  }

  getRarityColor(): string {
    return this.itemDataService.getRarityColor(this.item);
  }

  getRarity(): string {
    return ItemRarity[this.item.rarity];
  }
}
