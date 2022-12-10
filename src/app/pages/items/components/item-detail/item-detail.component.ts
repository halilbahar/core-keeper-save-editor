import { Component, OnInit } from '@angular/core';

import { ItemRarity } from '~enums';
import { InventorySlot, ItemData } from '~models';
import { CharacterService, ItemDataService, SelectedItemService } from '~services';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  rarityColor: string;
  item: ItemData;
  inventorySlot: InventorySlot;
  itemIndex: number;
  rarity: string;

  constructor(
    private characterService: CharacterService,
    private itemDataService: ItemDataService,
    private selectedItemService: SelectedItemService
  ) {}

  ngOnInit(): void {
    this.selectedItemService.$selectedItem.subscribe(index => {
      const inventorySlot = this.characterService.$character.value.inventory[index];
      if (inventorySlot.objectID !== 0) {
        this.inventorySlot = inventorySlot;
        this.itemIndex = index;
        this.item = this.itemDataService.getData(this.inventorySlot.objectID);
        this.rarity = ItemRarity[this.item.rarity];
        // this.rarityColor = this.itemDataService.getRarityColor(this.item.rarity);
        this.rarityColor = '#000000';
      }
    });
  }

  onAmountChange(event): void {
    console.log(event);
  }
}
