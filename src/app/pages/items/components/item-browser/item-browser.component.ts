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

  /**
   * @returns all labels of ItemCategories
   */
  getCategoryNames(): string[] {
    // This way the numbered version is filtered out
    return Object.values(ItemCategories).filter(value => typeof value === 'string') as string[];
  }
}
