import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { InventorySlot } from '~models';
import { CharacterService, SelectedItemService } from '~services';

@UntilDestroy()
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventory: InventorySlot[];

  constructor(
    private characterService: CharacterService,
    private selectedItemService: SelectedItemService
  ) {}

  ngOnInit(): void {
    this.characterService.$character.pipe(untilDestroyed(this)).subscribe(value => {
      this.inventory = value.inventory;
    });
  }

  /**
   * Event handler for the on click event on items
   * @param index of the inventory slot
   */
  onItemClick(index: number): void {
    this.selectedItemService.setSelectedItem(index);
  }
}
