import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { InventorySlot } from '~models';
import { CharacterService, DragNDropService, SelectedItemService } from '~services';

@UntilDestroy()
@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  equipmentSlots: InventorySlot[];
  indexToHide: number = -1;
  indexToSelect: number = -1;
  placeholder = [0, 1, 2, 3, 4, 4, 5, 6];

  constructor(
    private characterService: CharacterService,
    private selectedItemService: SelectedItemService,
    public dragNDropService: DragNDropService,
  ) {}

  ngOnInit(): void {
    this.characterService.$character
      .pipe(untilDestroyed(this))
      .subscribe(character => (this.equipmentSlots = character.inventory.slice(51, 58 + 1)));

    this.dragNDropService.$indexToHide
      .pipe(untilDestroyed(this))
      .subscribe(indexToHide => (this.indexToHide = indexToHide));

    this.selectedItemService.$selectedItem
      .pipe(untilDestroyed(this))
      .subscribe(index => (this.indexToSelect = index));
  }

  /**
   * Event handler for the on click event on items. If the same inventory slot gets clicked again, deselect by sending a value of -1.
   * @param index of the inventory slot
   */
  onItemClick(index: number): void {
    const currentIndex = this.selectedItemService.$selectedItem.value;
    const newIndex = currentIndex === index ? -1 : index;
    this.selectedItemService.$selectedItem.next(newIndex);
  }
}
