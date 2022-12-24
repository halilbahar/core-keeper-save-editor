import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, filter, Subject } from 'rxjs';

import { ItemCategories } from '~enums';
import { ItemData } from '~models';
import { ItemDataService } from '~services';

@UntilDestroy()
@Component({
  selector: 'app-item-browser',
  templateUrl: './item-browser.component.html',
  styleUrls: ['./item-browser.component.scss']
})
export class ItemBrowserComponent implements OnInit {
  private $modelChanged: Subject<string> = new Subject();

  itemData: { itemData: ItemData; hide: boolean }[] = [];
  itemCategories = ItemCategories;
  categories = [
    { name: 'Helm', id: 100 },
    { name: 'Chest Armor', id: 101 },
    { name: 'Pants Armor', id: 102 },
    { name: 'Necklace', id: 103 },
    { name: 'Ring', id: 104 },
    { name: 'Offhand', id: 105 },
    { name: 'Bag', id: 106 },
    { name: 'Melee Weapon', id: 500 },
    { name: 'Ranged Weapon', id: 501 },
    { name: 'Pickaxe', id: 603 },
    { name: 'Shovel', id: 600 },
    { name: 'Hoe', id: 601 },
    { name: 'Fishing Rod', id: 605 },
    { name: 'Watering can', id: 1200 },
    { name: 'Paint Tool', id: 604 },
    { name: 'Food', id: 1100 },
    { name: 'Valuable', id: 1300 },
    { name: 'Castable Items', id: 602 },
    { name: 'Placable Item', id: 800 }
  ];

  filterTerm: string = '';
  selectedCategory: number = -1;

  inventory_ids: string[] = [];

  constructor(private itemDataService: ItemDataService) {}

  /**
   * Initialize the items and a subscription which uses a debounce method.
   * This way the form will only be alerted after the last keystrok + 500ms
   */
  ngOnInit(): void {
    this.$modelChanged
      .pipe(debounceTime(150))
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        this.filterTerm = data;
        this.filterItems();
      });
    this.filterItems();

    // Get all items once
    this.itemData = Object.values(this.itemDataService.items).map(itemData => ({
      itemData,
      hide: false
    }));

    // Push inventory
    for (let i = 0; i < 50; i++) {
      this.inventory_ids.push(`inventory-${i}`);
    }
    // Push equipment
    for (let i = 0; i < 8; i++) {
      this.inventory_ids.push(`inventory-${i + 51}`);
    }
  }

  /**
   * Event handler for the input field.
   * @param event InputEvent
   */
  onFilterInput(event) {
    this.$modelChanged.next(event.target.value);
  }

  /**
   * Event handler for the select field.
   * @param category id
   */
  onCategorySelect(category: number) {
    this.selectedCategory = +category;
    this.filterItems();
  }

  /**
   * Filter the items by category whether the items belong to the current category (-1 for excluding this mechanisim)
   * and by name / objectID
   */
  filterItems() {
    for (const item of this.itemData) {
      const itemData = item.itemData;
      const isANumber = isNaN(Number(this.filterTerm));

      // If the item is not from the selected categories, go to the next item
      if (this.selectedCategory !== -1 && this.selectedCategory !== item.itemData.objectType) {
        item.hide = true;
        continue;
      }

      if (
        itemData.name.toLowerCase().includes(this.filterTerm.toLowerCase()) ||
        (isANumber && itemData.objectID === Number(this.filterTerm))
      ) {
        item.hide = false;
      } else {
        item.hide = true;
      }
    }
  }
}
