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
      // We we have a null index (initial state) don't do anything
      if (index == null) {
        return;
      }

      // If a index of -1 is given, reset (display nothing)
      if (index === -1) {
        this.reset();
      } else {
        // Show the item in the given slot. The only exception is for empty item slots (objectID === 0). These we don't display.
        const inventorySlot = this.characterService.$character.value.inventory[index];
        if (inventorySlot.objectID !== 0) {
          this.itemDetail = this.itemDataService.getItemDetail(inventorySlot.objectID);
          this.inventorySlot = inventorySlot;
          this.itemIndex = index;
          this.rarityLabel = ItemRarity[this.itemDetail.rarity];
        } else {
          this.reset();
        }
      }
    });
  }

  /**
   * Whenever the user is done editing the input field, this function will be called.
   * It Will check if the value is between 0 and item-max-durability or 999 when it is a stackable item.
   * When the value of the input field is valid, we change the inventoryslot
   * @param event
   */
  onAmountChange(event: Event): void {
    const traget = event.target as HTMLInputElement;
    const amount = parseInt(traget.value);

    const { isStackable, initialAmount } = this.itemDetail;
    const maxAmount = isStackable ? 999 : initialAmount;

    if (amount <= 0 || amount > maxAmount) {
      // We can't cancel this event. So have to reset the value manually
      traget.value = '' + this.inventorySlot.amount;
    } else {
      this.inventorySlot.amount = amount;
    }
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
