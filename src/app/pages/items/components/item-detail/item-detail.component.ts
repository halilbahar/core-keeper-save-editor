import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ItemRarity } from '~enums';
import { InventorySlot, ItemData, ItemDetail } from '~models';
import { CharacterService, ItemDataService, SelectedItemService } from '~services';

@UntilDestroy()
@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  itemDetail: ItemDetail;
  inventorySlot: InventorySlot;
  itemIndex: number;
  rarityLabel: string;

  constructor(
    private characterService: CharacterService,
    private itemDataService: ItemDataService,
    private selectedItemService: SelectedItemService
  ) {}

  ngOnInit(): void {
    this.selectedItemService.$selectedItem.pipe(untilDestroyed(this)).subscribe(index => {
      // If the index is set (it can be null due to BehaviourSubject needing an initial value)
      // Show the item in the given slot
      if (index != null) {
        // If an item is already selected and we select the same item again, we deselect it this time
        if (this.itemDetail != null && this.itemIndex === index) {
          this.reset();
        } else {
          // Otherwise we just select the given item slot. The only exception is for empty item slots (objectID === 0). These we don't display.
          const inventorySlot = this.characterService.$character.value.inventory[index];
          if (inventorySlot.objectID !== 0) {
            this.itemDetail = this.itemDataService.getItemDetail(inventorySlot.objectID);
            this.inventorySlot = inventorySlot;
            this.itemIndex = index;
            this.rarityLabel = ItemRarity[this.itemDetail.rarity];
          }
        }
      }
    });
  }

  onAmountChange(event): void {
    console.log(event);
  }

  /**
   * Reset all the variables. This equivalent to deselecting the current item.
   */
  private reset(): void {
    this.itemDetail = null;
    this.inventorySlot = null;
    this.itemIndex = null;
    this.rarityLabel = null;
  }
}
